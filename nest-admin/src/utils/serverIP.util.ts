import { networkInterfaces } from "os"

export const getServerUtilIp = () => {
    const nets = networkInterfaces()
    let ip = '127.0.0.1'
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ip = net.address
                break
            }
        }
    }
    return ip
}
