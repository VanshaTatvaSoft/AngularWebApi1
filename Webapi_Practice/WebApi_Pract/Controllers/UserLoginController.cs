using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi_Pract.Dto;
using WebApi_Pract.Middlewears;
using WebApi_Pract.Models;

namespace WebApi_Pract.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserLoginController(WebApiPractContext context, IConfiguration config) : ControllerBase
{
    private readonly WebApiPractContext _context = context;
    private readonly IConfiguration _config = config;

    #region Register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromForm] RegisterDto registerDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == registerDto.Email.ToLower()))
        {
            return Ok(new { Status = false, Message = "User with this email already exist" });
        }
        if (!await _context.Roles.AnyAsync(r => r.Id == registerDto.RoleId))
        {
            return Ok(new { Status = false, Message = "No such role exist" });
        }

        User user = new()
        {
            Email = registerDto.Email.ToLower(),
            Username = registerDto.Username,
            Roleid = registerDto.RoleId
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        UserLogin userLogin = new()

        {
            Userid = user.Id,
            Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
        };

        await _context.UserLogins.AddAsync(userLogin);
        await _context.SaveChangesAsync();

        return Ok(new { Status = true, Message = "User registered successfully" });
    }
    #endregion


    #region Login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromForm] LoginDto dto)
    {
        User user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.UserLogins)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.UserEmail.ToLower());

        if (user == null)
        {
            return Ok(new { Status = false, Message = "No such user exist" });
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.UserLogins.FirstOrDefault()?.Password))
        {
            return Ok(new { Status = false, Message = "Invalid password" });
        }

        return Ok(new
        {
            Status = true,
            Message = "User login successfully",
            AccessToken = GenerateAccessToken(user),
            RefreshToken = GenerateRefreshToken(user)
        });
    }
    #endregion

    #region Refresh
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromForm] RefreshTokenDto dto)
    {
        JwtSecurityTokenHandler handler = new();
        byte[] key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

        try
        {
            ClaimsPrincipal principal = handler.ValidateToken(dto.RefreshToken, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            String username = principal.Identity?.Name;
            User user = await _context.Users.Include(r => r.Role).FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return Unauthorized();

            return Ok(new
            {
                Status = true,
                Message = "Valid refresh token",
                AccessToken = GenerateAccessToken(user),
                RefreshToken = GenerateRefreshToken(user)
            });
        }
        catch
        {
            return Unauthorized("Invalid refresh token.");
        }
    }
    #endregion

    #region Jwt
    private string GenerateAccessToken(User user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.Rolename)
        ];

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken(User user)
    {
        Claim[] claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.Rolename)
        ];

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_config["Jwt:RefreshExpireDays"])),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    #endregion
}
