using System.ComponentModel.DataAnnotations;

namespace WebApi_Pract.Dto;

public class ProductDTO
{
    public int Id { get; set; }
    [Required]
    public string Productname { get; set; }
    [Required]
    public string Productdesc { get; set; }
    [Required]
    public decimal Productprice { get; set; }
    [Required]
    public int Productquantity { get; set; }
}
