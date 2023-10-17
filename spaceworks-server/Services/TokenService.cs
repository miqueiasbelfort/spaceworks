using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SpaceWorks.Models;

namespace SpaceWorks.Services;

public static class TokenService {
    public static string Generate(Usuario user){
        
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey);
        
        // Criando as credenciais para poder passar para a descrição e criptografala
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

        // Criando as informações sobre o token
        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = GenerateClaims(user),
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(4), // Expira em 2 horas
        };

        //GERAR UM TOKEN
        var token = handler.CreateToken(tokenDescriptor);
        // GERAR UMA STRING DO TOKEN
        var strToken = handler.WriteToken(token);

        return strToken;
    }

    private static ClaimsIdentity GenerateClaims(Usuario user){
        var ci = new ClaimsIdentity();
        ci.AddClaim(new Claim(ClaimTypes.Name, user.Id.ToString()));
        ci.AddClaim(new Claim(ClaimTypes.Role, user.Setor));
        ci.AddClaim(new Claim("Cargo", user.Cargo));
        return ci;
    }
}