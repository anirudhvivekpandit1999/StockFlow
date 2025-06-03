using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/sync")]
public class SyncController : ControllerBase
{
    // POST api/sync/push
    [HttpPost("push")]
    public async Task<IActionResult> Push([FromBody] SyncPushRequest request)
    {
        // Save/merge items to MSSQL here
        // ...
        return Ok();
    }

    // GET api/sync/pull
    [HttpGet("pull")]
    public async Task<IActionResult> Pull()
    {
        // Return new/updated items from MSSQL here
        var items = new List<object> {
            // Example: new { id = 1, name = "Laptop", ... }
        };
        return Ok(new { items });
    }
}

public class SyncPushRequest
{
    public List<InventoryItem> Items { get; set; }
}

public class InventoryItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Count { get; set; }
    public string SerialNumber { get; set; }
    public string Location { get; set; }
    public string LastModifiedBy { get; set; }
    public string LastModifiedOn { get; set; }
}
