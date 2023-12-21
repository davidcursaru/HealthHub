namespace NutritionManager.Interfaces
{
    public interface IEncryptionService
    {
        public string EncryptRefreshToken(string refreshToken);
        public string DecryptRefreshToken(string encryptedRefreshToken);
    }
}
