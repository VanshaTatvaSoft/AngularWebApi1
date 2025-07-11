using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi_Pract.Dto;
using WebApi_Pract.Middlewears;
using WebApi_Pract.Models;

namespace WebApi_Pract.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController(WebApiPractContext context) : ControllerBase
{
    private readonly WebApiPractContext _context = context;

    #region GetAllProducts
    // [Authorize]
    [CustomAuth("admin")]
    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts(string searchCriteria = null, int pageNumber = 1, int pageSize = 5)
    {
        IQueryable<Product> productsQuery = _context.Products.Where(p => !p.Isdeleted);

        if (!searchCriteria.IsNullOrEmpty())
        {
            productsQuery = productsQuery.Where(p => p.Productname.ToLower().Contains(searchCriteria.ToLower()));
        }

        int totalCount = await productsQuery.CountAsync();

        List<Product> products = await productsQuery
            .OrderBy(p => p.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            Status = true,
            Message = "All products fetched succesfully.",
            Products = products,
            TotalCount = totalCount
        });
    }
    #endregion

    #region Name
    [HttpGet("search")]
    public async Task<IActionResult> SearchProduct([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Ok(Array.Empty<string>());

        List<string> suggestions = await _context.Products
                            .Where(p => p.Productname.ToLower().StartsWith(query.ToLower()))
                            .OrderBy(p => p.Productname)
                            .Select(p => p.Productname)
                            .Take(7)
                            .ToListAsync();

        return Ok(suggestions);
    }
    #endregion

    #region AddProduct
    [HttpPost("products")]
    public async Task<IActionResult> AddProduct([FromForm] ProductDTO productDTO)
    {
        try
        {
            bool check = await _context.Products.AnyAsync(p => p.Productname.ToLower() == productDTO.Productname.ToLower());
            if (check)
            {
                return Ok(new
                {
                    Status = false,
                    Message = "Product with this name already exist."
                });
            }
            Product product = new()
            {
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

    #region EditProduct
    [HttpPut("products")]
    public async Task<IActionResult> EditProduct([FromForm] ProductDTO productDTO)
    {
        try
        {
            Product product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productDTO.Id);

            product.Productname = productDTO.Productname;
            product.Productdesc = productDTO.Productdesc;
            product.Productprice = productDTO.Productprice;
            product.Productquantity = productDTO.Productquantity;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Status = true,
                Message = "Product updated succesfully."
            });
        }
        catch (Exception)
        {
            return BadRequest(new
            {
                Status = false,
                Message = "Error updating product."
            });
        }
    }
    #endregion

    #region DeleteProduct
    [HttpDelete("products/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            Product product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound(new { Status = false, message = "Product not found." });
            }

            product.Isdeleted = true;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

            return Ok(new { Status = false, message = "Product deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Status = false, message = "An error occurred while deleting the product.", error = ex.Message });
        }
    }
    #endregion

}
