using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceWorks.Data;
using SpaceWorks.Models;
using SpaceWorks.ModelViews;
using SpaceWorks.Services;

namespace SpaceWorks.Controllers;

[ApiController]
[Route("v1/user")]
public class UsuarioController : ControllerBase {

    [HttpPost]
    [Route("signUp")]
    public async  Task<IActionResult> RegisterUser([FromServices]DatabaseContext context, [FromBody]Usuario usuario){    
        
        if(!ModelState.IsValid){
            return BadRequest();
        }

        try {
            
            var hash = new PasswordHash();
            usuario.Senha = hash.Hash(usuario.Senha);

            await context.Usuarios.AddAsync(usuario);
            await context.SaveChangesAsync();

            ResponseView res = new(){
                UserId = usuario.Id,
                Username = usuario.Nome,
                Setor = usuario.Setor,
                Cargo = usuario.Cargo,
                Token = TokenService.Generate(usuario)
            };
            
            return Created("/v1/user/signIn", res);

        }
        catch (Exception ex) {
            
            return BadRequest(ex.Message);

        }
    }

    [HttpPost]
    [Route("signIn")]
    public async Task<IActionResult> LoginUser([FromServices]DatabaseContext context, [FromBody]UsuarioView usuario){
      
        if(!ModelState.IsValid){
            return NotFound();
        }
        try {
           
            var user = await context.Usuarios.FirstOrDefaultAsync(x => x.Nome == usuario.Usuario);
            if(user == null){
                return NotFound("Usuário não encontrado");
            }
           
            var hash = new PasswordHash();
            if(!hash.Verify(user.Senha, usuario.Senha)){
                return BadRequest();
            } 

            string token =  TokenService.Generate(user);
            
            ResponseView res = new(){
                UserId = user.Id,
                Username = user.Nome,
                Setor = user.Setor,
                Cargo = user.Cargo,
                Token = token
            };

            return Ok(res);

        }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Route("all-users/skip/{skip:int}/take/{take:int}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> AllUsers([FromServices]DatabaseContext context, [FromRoute]int skip = 0, [FromRoute]int take = 2, [FromQuery]string? search = null){
        try {

            if(skip >= 1000){
                return BadRequest();
            }
            
            var total = await context.Usuarios.CountAsync();

            IQueryable<Usuario> query = context.Usuarios;

            // Aplicar filtro de pesquisa se houver um termo de pesquisa
            if (!string.IsNullOrWhiteSpace(search)) {
                query = query.Where(u =>
                    u.Nome.Contains(search) ||
                    u.Email.Contains(search) ||
                    u.Cargo.Contains(search) ||
                    u.Setor.Contains(search)
                );
            }

            List<UsuarioNoPassword> users = await query
                .AsNoTracking()
                .Select(u => new UsuarioNoPassword{
                    Id = u.Id,
                    Nome = u.Nome,
                    Email = u.Email,
                    Cargo = u.Cargo,
                    Setor = u.Setor,
                    CriadoEm = u.CriadoEm
                })
                .Skip(skip)
                .Take(take)
                .ToListAsync(); 

            int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);

            if(userId == null){
                return Unauthorized("Nenhuma altorização foi encontrada!");
            }

            Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);

            if(user == null){
                return NotFound("Nenhum Id foi encontrado");
            }

            // Calcular o número da página
            // int pages = total / take;

            return Ok(new{
                total,
                skip,
                take,
                // pages,
                data = users
            });
        }
        catch (Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Route("{id}")]
    [Authorize]
    public async Task<IActionResult> User([FromServices]DatabaseContext context, [FromRoute]int id){
        
        int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);
        if(userId == null){
            return Unauthorized("Nenhuma altorização foi encontrada!");
        }
        Usuario userLoged = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
        if(userLoged == null){
            return NotFound("Nenhum Id foi encontrado");
        }
        if(userLoged.Cargo != "Desenvolvedor"){
            return Unauthorized("Sem acesso a essa funcionalidade");
        }

        try {
            Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
            
            if(user == null){
                return NotFound();
            }

            UsuarioNoPassword userNotPassword = new(){
                Id = user.Id,
                Nome = user.Nome,
                Email = user.Email,
                Setor = user.Setor,
                Cargo = user.Cargo,
                CriadoEm = user.CriadoEm
            };

            return Ok(userNotPassword);
        }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Route("user-by-token")]
    public async Task<IActionResult> GetUserByToken([FromServices]DatabaseContext context){
        try {

            int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);
            
            if(userId == null){
                return Unauthorized("Nenhuma altorização foi encontrada!");
            }
            
            Usuario userLoged = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
            
            if(userLoged == null){
                return NotFound("Nenhum Id foi encontrado");
            }

            UsuarioNoPassword user = new(){
                Id = userLoged.Id,
                Nome = userLoged.Nome,
                Email = userLoged.Email,
                Setor = userLoged.Setor,
                Cargo = userLoged.Cargo,
                CriadoEm = userLoged.CriadoEm
            };

            return Ok(user);

        }
        catch(Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [Route("edit/{id}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> EditUser([FromServices]DatabaseContext context, [FromRoute]int id, [FromBody]UsuarioNoPassword usuario){
        
        int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);

        if(userId == null){
            return Unauthorized("Nenhuma altorização foi encontrada!");
        }

        Usuario userLoged = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
       
        if(userLoged == null){
            return NotFound("Nenhum Id foi encontrado");
        }

        if(userLoged.Cargo != "Desenvolvedor"){
            return Unauthorized("Sem acesso a essa funcionalidade");
        }

        try {

            Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);

            if(user == null){
                return NotFound();
            }

            user.Nome = usuario.Nome;
            user.Setor = usuario.Setor;
            user.Email = usuario.Email;
            user.Cargo = usuario.Cargo;
            user.CriadoEm = DateTime.Now.ToLocalTime();

            context.Usuarios.Update(user);
            await context.SaveChangesAsync();

            return Ok($"Usuário {user.Nome} editado!");
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }

    }

    [HttpDelete]
    [Route("delete/{id}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> DeleteUser([FromServices]DatabaseContext context, [FromRoute]int id){

        int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);

        if(userId == null){
            return Unauthorized("Nenhuma altorização foi encontrada!");
        }

        Usuario userLoged = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
       
        if(userLoged == null){
            return NotFound("Nenhum Id foi encontrado");
        }

        if(userLoged.Cargo != "Desenvolvedor"){
            return Unauthorized("Sem acesso a essa funcionalidade");
        }

        try {
            Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
            
            if(user == null){
                return NotFound();
            }

            context.Usuarios.Remove(user);
            await context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }

    }
}