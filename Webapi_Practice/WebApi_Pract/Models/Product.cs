using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebApi_Pract.Models;

public partial class Product
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("productname")]
    [StringLength(100)]
    public string Productname { get; set; }

    [Required]
    [Column("productdesc")]
    [StringLength(500)]
    public string Productdesc { get; set; }

    [Column("productprice", TypeName = "money")]
    public decimal Productprice { get; set; }

    [Column("productquantity")]
    public int Productquantity { get; set; }

    [Column("isdeleted")]
    public bool Isdeleted { get; set; }
}
