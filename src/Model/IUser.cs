namespace Hexamer.Model
{
    public interface IUser
    {
        string Name { get; }
        string Email { get; }
        string Username { get; }
        string ImageUrl { get; }
    }
}