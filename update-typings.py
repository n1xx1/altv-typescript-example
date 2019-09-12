import requests

def save_file(url, dest):
    r = requests.get(url, allow_redirects=True)
    with open(dest, "wb") as f:
        f.write(r.content)

if __name__ == "__main__":
    save_file("https://cdn.altv.mp/beta/utils/altv-client.d.ts", "./src/client/@types/alt.d.ts")
    save_file("https://cdn.altv.mp/beta/utils/natives.d.ts", "./src/client/@types/native.d.ts")
    
    save_file("https://cdn.altv.mp/node-module/beta/utils/altv-server.d.ts", "./src/server/@types/alt.d.ts")
