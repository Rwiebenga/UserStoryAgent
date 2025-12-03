using System;
using System.ComponentModel.DataAnnotations;

namespace FindMyEmbassy.Models
{
    /// <summary>
    /// Model for: Some great new idea!
    /// User Story: US-5
    /// </summary>
    public class SomeModel
    {
        public int Id { get; set; }
        
        // TODO: Add properties based on acceptance criteria
        // Example:
        // [Required]
        // public string Name { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
