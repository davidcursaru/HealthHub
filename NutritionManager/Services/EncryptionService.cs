using Microsoft.IdentityModel.Tokens;
using NutritionManager.Interfaces;
using System;
using System.Security.Cryptography;
using System.Text;

namespace NutritionManager.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly string _encryptionKey; // Encryption key (should be kept secure)

        public EncryptionService(IConfiguration config)
        {
            _encryptionKey = config["EncryptionKey"];
        }

        public string EncryptRefreshToken(string refreshToken)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aesAlg.IV = new byte[16]; // Initialization Vector

                // Create an encryptor to perform the stream transform
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            // Write the data to the stream
                            swEncrypt.Write(refreshToken);
                        }
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
        }

        public string DecryptRefreshToken(string encryptedRefreshToken)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(_encryptionKey);
                aesAlg.IV = new byte[16]; // Initialization Vector

                // Create a decryptor to perform the stream transform
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption
                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(encryptedRefreshToken)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream and place them in a string
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}
