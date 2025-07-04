using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi_Pract.Dto;
using WebApi_Pract.Models;

namespace WebApi_Pract.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(WebApiPractContext context) : ControllerBase
{
    private readonly WebApiPractContext _context = context;

    #region GetAllProducts
    [Authorize]
    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts()
    {
        List<Product> products = await _context.Products.ToListAsync();
        return Ok(new
        {
            Status = true,
            Message = "All products fetched succesfully.",
            Products = products
        });
    }
    #endregion

    #region AddProduct
    [HttpPost("products")]
    public async Task<IActionResult> AddProduct([FromForm] ProductDTO productDTO)
    {
        try
        {
            Product product = new(){
                Productname = productDTO.Productname,
                Productdesc = productDTO.Productdesc,
                Productprice = productDTO.Productprice,
                Productquantity = productDTO.Productquantity
            };
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Status = true,
                Message = "Product added succesfully."
            });
        }
        catch (Exception)
        {
            return BadRequest(new
            {
                Status = false,
                Message = "Error adding product."
            });
        }
    }
    #endregion

}
