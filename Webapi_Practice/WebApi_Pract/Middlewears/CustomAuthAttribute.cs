using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace WebApi_Pract.Middlewears;

public class CustomAuthAttribute(string roles) : Attribute, IAuthorizationFilter
{
    private readonly string[] _roles = roles.Split(',').Select(r => r.Trim()).ToArray();

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        String token = context.HttpContext.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
        // string fingerprint = context.HttpContext.Request.Headers["X-Client-Fingerprint"].FirstOrDefault();
        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedResult();
            return;
        }
        IConfiguration cfg = context.HttpContext.RequestServices.GetService<IConfiguration>()!;
        byte[] key = Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!);

        try
        {
            JwtSecurityTokenHandler handler = new();
            ClaimsPrincipal principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            String role = principal.FindFirst(ClaimTypes.Role)?.Value;
            string fp = principal.FindFirst("fingerprint")?.Value;

            // if(fp != fingerprint)
            // {
            //     context.Result = new UnauthorizedResult();
            // }

            if (!_roles.Contains(role, StringComparer.OrdinalIgnoreCase))
            {
                context.Result = new ForbidResult();
                return;
            }

            context.HttpContext.User = principal;
        }
        catch (SecurityTokenExpiredException)
        {
            context.HttpContext.Response.Headers.Append("Token-Expired", "true");
            context.HttpContext.Response.Headers.Append("Access-Control-Expose-Headers", "Token-Expired");

            context.Result = new UnauthorizedResult();
        }
        catch (Exception)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}
