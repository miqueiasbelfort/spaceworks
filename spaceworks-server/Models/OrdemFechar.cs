using SpaceWorks.ModelViews;

namespace SpaceWorks.Models;

public class OrdemFechar {
    public int Id { get; set; }
    public string Responsavel { get; set; }
    public string Descricao { get; set; }
    public DateTime FechadoEm { get; set; } = DateTime.Now.ToLocalTime();
}