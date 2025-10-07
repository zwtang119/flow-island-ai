<p align="center">
  <a href="#zh">🇨🇳 中文</a> | <a href="#en">🇬🇧 English</a>
</p>

---

<h1 id="zh" align="center">🏝️ Flow-Island · 心流静岛</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/zwtang119/flow-island-ai/main/docs/screenshots/flow-island-cover.png" width="850" alt="心流静岛 (Flow-Island) 产品Logo与设备渲染图">
</p>

<p align="center">
  <em>让重要的事，被听见、被理解、被静静呈现。</em>
</p>

<p align="center">
「心流静岛」是一款为长者设计的AI陪伴设备，让守护看得见、让关怀有回应。用温柔的科技，延长亲情的半径。
</p>

<p align="center">
  <a href="https://zwtang119.github.io/flow-island-ai/" style="display: inline-block; padding: 12px 24px; background-color: #4A6A8F; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
    👉 访问品牌主站，感受守望
  </a>
</p>
<p align="center" style="color: #666660; font-style: italic;">一份安心的礼物，送给最重要的家人。</p>

<br>

---

## 🤔 我们为何创造心流静岛？

在一个充满数字噪音的时代，智能手机的“注意力黑洞”不仅消耗着我们的精力，也让家人间的关怀变得碎片化、难以被感知。我们相信，最好的科技是让人感觉不到科技的存在，是服务于最质朴的情感连接。

**“心流静岛”** 诞生的目的，就是对抗这种信息过载，为我们最重要的思绪和最关心的人，开辟一座宁静的、永远在线的“信息静岛”。

---

## 💡 它如何工作？

我们相信，最好的科技是让人感觉不到科技的存在。心流静岛的流程如呼吸般自然：

```
[ 🗣️ 你的声音 ] → [ 🧠 AI的理解 (Gemini API) ] → [ ⚫️ 墨水屏上看得见的“安心” ]
```

---

## 🧭 项目结构导览 (Mono-Repo)

本项目采用 Mono-Repo 结构，将所有子项目和文档统一管理，清晰地呈现了产品的完整演进脉络。

| 模块 | 说明 | 入口 |
| :--- | :--- | :--- |
| **`(根目录)`** | ❤️ **品牌主站**：产品的灵魂归宿，一个为家庭守望而生的概念站 | **[访问主站](https://zwtang119.github.io/flow-island-ai/)** |
| **`flow-island-core/`** | 🧠 **核心产品**：为高效能人士打造的专注力工具 (需要自备API Key) | **[查看代码](./flow-island-core/)** |
| **`ai-sticky-note-legacy/`**| 🕰️ **前身归档**：一切开始的地方，“AI便利贴”的技术原型 | **[查看代码](./ai-sticky-note-legacy/)** |
| **`docs/`** | 📚 **文档中心**：项目的“真理之源”，包含故事、架构、路线图等 | **[查看文档](./docs/)** |

---

## 🚀 部署三部曲

部署“心流静岛”需要本地服务器与硬件固件的配合。请遵循以下指南完成设置。

1.  **[第一步：设置本地服务器](./docs/guides/01-server-setup.md)**
    > 安装 Node.js 环境，并启动作为数据中转站的本地服务。

2.  **[第二步：刷写手表固件](./docs/guides/02-firmware-flashing.md)**
    > 为您的 Watchy 电子墨水屏手表刷写专用固件，使其能与本地服务器通信。

3.  **[第三步：开始使用与排查](./docs/guides/03-troubleshooting.md)**
    > 访问 Web UI 进行语音输入，并参考指南解决部署中可能遇到的常见问题。

---

## 🧩 技术栈

- **前端**: 原生 HTML, CSS, JavaScript (零依赖)
- **AI 服务**: Google Gemini API
- **本地服务器**: Node.js, Express, Sharp
- **硬件**: Watchy (基于 ESP32 的电子墨水屏手表)

---

## 📜 开源理念

我们相信，最好的智能设备，不是取代人，而是让人更安心。
本项目遵循**「简单、务实、可靠」**的工程哲学：
- **简单**: 不追求华丽的功能，只构建能解决核心问题的最小闭环。
- **务实**: 不堆叠技术，只选择能长期稳定运行的、最简单的技术栈。
- **可靠**: 不依赖大厂平台，核心系统均可自部署，确保数据的私密与服务的长久。

---

### 🤝 贡献与讨论

欢迎所有开发者 Fork 本项目进行改进，或在 **[Issues](https://github.com/zwtang119/flow-island-ai/issues)** 中提出宝贵的建议。
你的每一次反馈，都将帮助“心流静岛”变得更实用、更温暖。

---
<br><br>

<h1 id="en" align="center">🏝️ Flow-Island</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/zwtang119/flow-island-ai/main/docs/screenshots/flow-island-cover.png" width="350" alt="Flow-Island Product Logo and Device Render">
</p>

<p align="center">
  <em>Let what matters be heard, understood, and calmly presented.</em>
</p>

<p align="center">
Flow Island is an AI-powered mindful companion for seniors — turning calm technology into heartfelt guardianship. Built to make care visible, connection effortless, and every moment watched with warmth.
</p>


<p align="center">
  <a href="https://zwtang119.github.io/flow-island-ai/" style="display: inline-block; padding: 12px 24px; background-color: #4A6A8F; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
    👉 Visit the Brand Website & Experience the Watchful Care
  </a>
</p>
<p align="center" style="color: #666660; font-style: italic;">A gift of peace of mind, for the people who matter most.</p>

<br>

---

## 🤔 Why We Created Flow-Island

In an era of digital noise, the "attention black hole" of smartphones not only drains our energy but also fragments the care we share with family, making it hard to perceive. We believe the best technology is invisible, serving the most genuine emotional connections.

**Flow-Island** was born to combat this information overload, creating a quiet, always-on "information island" for our most important thoughts and for the people we care about most.

---

## 💡 How does it work?

We believe the best technology is technology that feels invisible. The workflow of Flow-Island is as natural as breathing:

```
[ 🗣️ Your Voice ] → [ 🧠 AI's Understanding (Gemini API) ] → [ ⚫️ Visible "Peace of Mind" on E-Ink ]
```

---

## 🧭 Project Structure (Mono-Repo)

This project uses a Mono-Repo structure to manage all sub-projects and documentation in one place, clearly presenting the product's complete evolutionary path.

| Module | Description | Entry Point |
| :--- | :--- | :--- |
| **`(Root Directory)`** | ❤️ **Brand Website**: The project's spiritual home, a concept site born to watch over families. | **[Visit Website](https://zwtang119.github.io/flow-island-ai/)** |
| **`flow-island-core/`** | 🧠 **Core Product**: A focus tool for high-performance individuals (requires your own API Key). | **[View Code](./flow-island-core/)** |
| **`ai-sticky-note-legacy/`**| 🕰️ **Legacy Archive**: Where it all began, the technical prototype of the "AI Sticky Note". | **[View Code](./ai-sticky-note-legacy/)** |
| **`docs/`** | 📚 **Documentation Hub**: The project's "source of truth," containing its story, architecture, roadmap, etc. | **[View Docs](./docs/)** |

---

## 🚀 Deployment Trilogy

Deploying Flow-Island requires coordination between the local server and the hardware firmware. Please follow these guides to complete the setup.

1.  **[Step 1: Set Up the Local Server](./docs/guides/01-server-setup.md)**
    > Install the Node.js environment and start the local service that acts as a data relay.

2.  **[Step 2: Flash the Watchy Firmware](./docs/guides/02-firmware-flashing.md)**
    > Flash the dedicated firmware onto your Watchy e-ink watch to enable communication with the local server.

3.  **[Step 3: Usage & Troubleshooting](./docs/guides/03-troubleshooting.md)**
    > Access the Web UI for voice input and refer to the guide to resolve common deployment issues.

---

## 🧩 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (Zero Dependencies)
- **AI Service**: Google Gemini API
- **Local Server**: Node.js, Express, Sharp
- **Hardware**: Watchy (an ESP32-based e-ink watch)

---

## 📜 Open Source Philosophy

We believe the best smart devices don't replace people—they bring peace of mind. This project follows an engineering philosophy of **"Simple, Pragmatic, and Reliable"**:
- **Simple**: We don't chase flashy features, only building the minimum viable loop to solve the core problem.
- **Pragmatic**: We don't stack technologies, only choosing the simplest stack that ensures long-term stability.
- **Reliable**: We don't depend on big tech platforms; the core system is self-hostable to ensure data privacy and service longevity.

---

### 🤝 Contributing & Discussion

All developers are welcome to fork this project for improvements or to raise valuable suggestions in the **[Issues](https://github.com/zwtang119/flow-island-ai/issues)** section.
Every piece of your feedback helps make Flow-Island more practical and warmer.
