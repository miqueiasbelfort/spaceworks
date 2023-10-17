using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceWorks.Data;
using SpaceWorks.Models;
using SpaceWorks.ModelViews;

namespace SpaceWorks.Controllers;

[ApiController]
[Route("v1/chamado")]
public class ChamadoController : ControllerBase {

    [HttpPost("create-chamado")]
    [Authorize]
    public async Task<IActionResult> CreateChamado([FromServices]DatabaseContext context, [FromBody]Chamado chamado){
        
        if(!ModelState.IsValid){
            return BadRequest();
        }

        int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);

        if(userId == null){
            return Unauthorized("Nenhuma altorização foi encontrada!");
        }
        Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
        if(user == null){
            return NotFound("Nenhum Id foi encontrado");
        }

        try {

            var userInData = await context.UsuarioNoPasswords.FirstOrDefaultAsync(x => x.Id == user.Id);

            UsuarioNoPassword newUser;

            if(userInData == null){
                newUser = new UsuarioNoPassword(){
                    Id = user.Id,
                    Nome = user.Nome,
                    Email = user.Email,
                    Cargo = user.Cargo,
                    Setor = user.Setor,
                    CriadoEm = user.CriadoEm
                };
            } else {
                newUser = userInData;
            }

            chamado.Usuario = newUser;
            await context.Chamados.AddAsync(chamado);
            await context.SaveChangesAsync();
            return Created("/create-chamado", chamado);
        }
        catch (Exception ex){
            if (ex.InnerException != null) {
                return BadRequest(ex.InnerException.Message);
            }
            return BadRequest(ex.Message);
        }

    }

    [HttpPut("close-chamado/{id}")]
    [Authorize]
    public async Task<IActionResult> CloseChamado([FromServices]DatabaseContext context, [FromBody]OrdemFechar fechar, [FromRoute]int id){
        if(!ModelState.IsValid){
            return BadRequest();
        }

        int? userId = Convert.ToInt32(HttpContext.User.FindFirst(ClaimTypes.Name).Value);

        if(userId == null){
            return Unauthorized("Nenhuma altorização foi encontrada!");
        }
        Usuario user = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == userId);
        if(user == null){
            return NotFound("Nenhum Id foi encontrado");
        }

        Chamado chamado = await context.Chamados.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if(chamado == null){
            return NotFound();
        }


        try {
            
            chamado.OrdemDeFechar = fechar;
            chamado.Status = false;
            chamado.CriadoEm = DateTime.Now.ToLocalTime();

            context.Chamados.Update(chamado);
            await context.SaveChangesAsync();
            return Ok(chamado);
        }
        catch (Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("all-chamados")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> GetAll([FromServices]DatabaseContext context){
        try {
            List<Chamado> chamados = await context.Chamados.Include(e => e.Usuario).Include(e => e.OrdemDeFechar).ToListAsync();
            return Ok(chamados);
        }
        catch (Exception ex) {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("all-chamados/open/skip/{skip:int}/take/{take:int}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> GetAllOpen([FromServices]DatabaseContext context, [FromRoute]int skip = 0, [FromRoute]int take = 10, [FromQuery]string? search = null){
        try{

             IQueryable<Chamado> query = context.Chamados;

            // Aplicar filtro de pesquisa se houver um termo de pesquisa
            if (!string.IsNullOrWhiteSpace(search)) {
                query = query.Where(u =>
                    u.Titulo.Contains(search) ||
                    u.Usuario.Nome.Contains(search) ||
                    u.Setor.Contains(search)
                );
            }

            var total = await context.Chamados.CountAsync();
            
            List<Chamado> chamados = await query
                .AsNoTracking()
                .Include(e => e.Usuario)
                .Where(e => e.Status == true).OrderBy(e => e.Ordem)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            return Ok(new{
                total,
                skip,
                take,
                data = chamados
            });
        }
        catch (Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> GetChamado([FromServices]DatabaseContext context, [FromRoute]int id){
        try {
            
            Chamado chamado = await context.Chamados
                .Include(e => e.Usuario)
                .Include(e => e.OrdemDeFechar)
                .FirstOrDefaultAsync(x => x.Id == id);

            if(chamado == null){
                return NotFound();
            }

            return Ok(chamado);
        }
        catch (Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "TI")]
    public async Task<IActionResult> DeleteChamado([FromServices]DatabaseContext context, [FromRoute]int id){
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
            Chamado chamado = await context.Chamados
                .Include(e => e.Usuario).Include(e => e.OrdemDeFechar)
                .FirstOrDefaultAsync(x => x.Id == id);
            
            if(chamado == null){
                return NotFound();
            }
            
            UsuarioNoPassword usuarioNoPassword = await context.UsuarioNoPasswords.FirstOrDefaultAsync(x => x.Id == chamado.Usuario.Id);
            if(usuarioNoPassword == null){
                return BadRequest("Nenhum usuário encontrado");
            }

            OrdemFechar ordemFechar = await context.ordemFechars.FirstOrDefaultAsync(x => x.Id == chamado.OrdemDeFechar.Id);
            if(ordemFechar == null){
                return BadRequest("Nenhuma ordem encontrada");
            }

            context.UsuarioNoPasswords.Remove(usuarioNoPassword);
            context.ordemFechars.Remove(ordemFechar);
            context.Chamados.Remove(chamado);

            await context.SaveChangesAsync();
            
            return NoContent();
        }
        catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }
}