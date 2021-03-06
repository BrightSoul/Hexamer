﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AutoMapper;
using Hexamer.Model;
using Hexamer.Services;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Newtonsoft.Json.Serialization;
using System.Data.Common;
using Microsoft.Data.Sqlite;
using CommonMark;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Hexamer
{
    public class Startup
    {
        private string contentRootPath;
        public Startup(IHostingEnvironment env)
        {
            contentRootPath = env.ContentRootPath;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }
            Configuration = builder.Build();
            CommonMarkSettings.Default.OutputDelegate = (doc, output, settings) => new CustomHtmlFormatter(output, settings).WriteDocument(doc);
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddTransient<IExamRepository, ExamRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<IAnswerRepository, AnswerRepository>();
            services.AddSingleton<DbProviderFactory>(SqliteFactory.Instance);
            services.AddSingleton<AppConfig, AppConfig>(provider => AppConfig.FromConfiguration(Configuration, contentRootPath));
            services.AddSingleton<IStatistics, FileStatistics>();
            services.AddSingleton<IAuthority, CookieAuthority>();
            services.AddMemoryCache();
            services.AddMvc(options =>
            {
                var policy = new AuthorizationPolicyBuilder()
                     .RequireAuthenticatedUser()
                     .Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            }).AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddAuthorization(options =>
            {
                var administratorPolicy = new AuthorizationPolicyBuilder()
                .RequireClaim(ClaimTypes.Role, "Administrator")
                .Build();
                options.AddPolicy("Administrator", administratorPolicy);
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Hexamer API", Version = "v1" });
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new List<string> { "/Layout.html" }
            });
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = ctx =>
                {
                    ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=6000");
                }
            });
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error.html");
            }
            app.UseCookieAuthentication(new CookieAuthenticationOptions()
            {
                AuthenticationScheme = Configuration["App:AuthenticationScheme"],
                LoginPath = new PathString("/"),
                AccessDeniedPath = new PathString("/Error.html"),
                AutomaticAuthenticate = true,
                AutomaticChallenge = true
                //Events 
            });
            app.UseMvc();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hexamer API V1");
            });
        }
    }
}