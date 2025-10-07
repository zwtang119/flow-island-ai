
# 第一部分：本地服务器设置

本部分将指导您完成 Node.js 本地服务器的安装、配置和运行。

---

### **前提条件**

在开始之前，请确保已准备好以下硬件和软件。

#### 硬件
*   Watchy 电子墨水屏手表
*   计算机 (Windows, macOS, or Linux)
*   USB-C 数据线 (支持数据传输)

#### 软件 & 服务
*   **Node.js**: [下载链接 (推荐 LTS 版本)](https://nodejs.org/)
*   **Arduino IDE**: [下载链接 (推荐 1.8.x 版本)](https://www.arduino.cc/en/software)
*   **Google Gemini API Key**: [获取链接](https://aistudio.google.com/app/apikey)

---

### **步骤 1：服务器安装与配置**

本地服务器是连接 Web UI 和 Watchy 设备的通信中间件。

**1.1 创建项目目录**
在本地文件系统中创建一个新目录，用于存放项目文件 (例如 `flow-island-server`)。将所有项目文件直接放入此目录。

**1.2 安装依赖项**
1.  打开系统终端 (Terminal) 或命令提示符 (Command Prompt)。
2.  使用 `cd` 命令导航至项目目录。例如，如果您将项目放在桌面上名为 `flow-island-server` 的文件夹中：
    *   **macOS / Linux**: `cd ~/Desktop/flow-island-server`
    *   **Windows**: `cd C:\Users\YourUsername\Desktop\flow-island-server` (请将 `YourUsername` 替换为您的实际用户名)

3.  执行以下命令安装所有必需的依赖项：
    ```bash
    npm install
    ```
    > **说明**: 此命令将读取 `package.json` 文件，自动安装所有必需的库。

完成后，项目目录结构应如下所示：
```
flow-island-server/
├── node_modules/
├── package.json
├── package-lock.json
├── server.js
└── ... (其他项目文件)
```

**1.3 启动服务器**
1.  在终端中，根据您的操作系统，使用相应命令启动服务器。**将 `YOUR_API_KEY` 替换为您自己的 Gemini API 密钥。**

    *   **macOS / Linux**:
        ```bash
        API_KEY="YOUR_API_KEY" node server.js
        ```

    *   **Windows (CMD)**:
        ```cmd
        set API_KEY=YOUR_API_KEY&&node server.js
        ```
    
    *   **Windows (PowerShell)**:
        ```powershell
        $env:API_KEY="YOUR_API_KEY"; node server.js
        ```

2.  服务器成功启动后，终端将显示访问地址。
    ```
    > LAN Access (Choose the correct one for your network):
        - http://172.23.48.1:3000   (可能是 WSL 或虚拟网卡)
        - http://192.168.137.1:3000 (可能是电脑热点)
        - http://192.168.1.10:3000   (可能是 Wi-Fi)
    ```
    **记录正确的IP地址**: 计算机可能拥有多个IP地址。请选择与您的 Watchy 设备所在网络相匹配的那个地址（例如，如果您使用电脑热点，就选择热点对应的IP）。**此地址将在固件配置中使用。**

3.  **保持此终端窗口运行。**

**1.4 访问 Web UI**
在您的浏览器中，通过以下地址访问Web应用：

*   **本地访问 (推荐)**:
    `http://localhost:3000`
    *注：使用此地址可确保麦克风权限正常授予。*

如果Web UI加载成功，则服务器部署完成。

---
**部署已完成第一部分。** 下一步，请继续进行 **[第二部分：Watchy 固件刷写](./02-firmware-flashing.md)**。