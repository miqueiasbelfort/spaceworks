using System.Text.Json.Serialization;

namespace SpaceWorks.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum OrderEnum {
    Alto,
    Media,
    Baixa
}