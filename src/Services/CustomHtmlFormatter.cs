using CommonMark;
using CommonMark.Syntax;

namespace Hexamer.Services
{
    public class CustomHtmlFormatter : CommonMark.Formatters.HtmlFormatter
    {
        public CustomHtmlFormatter(System.IO.TextWriter target, CommonMarkSettings settings)
            : base(target, settings)
        {
        }

        protected override void WriteInline(Inline inline, bool isOpening, bool isClosing, out bool ignoreChildNodes)
        {
            if (
                // verify that the inline element is one that should be modified
                inline.Tag == InlineTag.Link
                // verify that the formatter should output HTML and not plain text
                && !this.RenderPlainTextInlines.Peek())
            {
                // instruct the formatter to process all nested nodes automatically
                ignoreChildNodes = false;

                // start and end of each node may be visited separately
                if (isOpening)
                {
                    this.Write("<a target=\"_blank\" href=\"");
                    this.WriteEncodedUrl(inline.TargetUrl);
                    this.Write("\">");
                }

                // note that isOpening and isClosing can be true at the same time
                if (isClosing)
                {
                    this.Write("</a>");
                }
            }
            else
            {
                // in all other cases the default implementation will output the correct HTML
                base.WriteInline(inline, isOpening, isClosing, out ignoreChildNodes);
            }
        }
    }
}