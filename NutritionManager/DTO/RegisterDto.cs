using System.ComponentModel.DataAnnotations;

namespace NutritionManager.DTO
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        //[StringLength(6, MinimumLength = 4)]
        public string Password { get; set; }
        [Required]
        public string Firstname { get; set; }
        [Required]
        public string Lastname { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Weight { get; set; }
        [Required]
        public string Height { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
    }
}
