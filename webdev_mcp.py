from mcp.server.mcpserver import MCPServer
import subprocess, os

mcp = MCPServer("WebDevAssistant")

@mcp.tool()
def run_npm(args: str) -> str:
    """Run an npm command (install, build, dev, etc.)"""
    result = subprocess.run(f"npm {args}", capture_output=True, text=True, shell=True)
    return result.stdout[-2000:] or result.stderr[-2000:]

@mcp.tool()
def read_file(path: str) -> str:
    """Read a file from disk."""
    with open(path) as f:
        return f.read()

@mcp.tool()
def write_file(path: str, content: str) -> str:
    """Write content to a file."""
    with open(path, "w") as f:
        f.write(content)
    return f"Written {len(content)} bytes to {path}"

@mcp.tool()
def list_files(path: str = ".") -> list[str]:
    """List files in a directory."""
    return os.listdir(path)

if __name__ == "__main__":
    mcp.run(transport="streamable-http", port=8001)
