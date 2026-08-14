# ModLens + Settings 插件 — 部署与验证清单

自制插件：ModLens（MIT fork）增加 DSH Settings 可视化配置。
代码位置：`D:\develop\modlens`（本地开发目录，尚未推 GitHub）。

## 已完成的代码改动（文件层面）

| 文件 | 改动 |
|---|---|
| `D:\develop\modlens\dsh\settings.js` | 新增：注册 `modlens` settings 命名空间（provider + gemini-api/openai/anthropic 的 apiKey[secret]/baseUrl/model），非密钥字段同步写 `~/.modlens/config.json`，密钥经环境变量注入 CLI |
| `D:\develop\modlens\dsh\index.js` | `apply()` 调用 `registerSettings`；`run()` 支持 env；read_image 工具与粘贴转换两处 CLI 调用注入密钥 env |
| `D:\develop\modlens\package.json` | dependencies 加 `@deepseek-ai/schemastery@^3.18.1` |
| `D:\deepseek-harness\packages\host\apiproxy\src\api-proxy.ts` | `WEB_SETTINGS_NAMESPACES` 加 `'modlens'`（设置页显示开关） |
| `C:\Users\刘增凡\.dsh\profiles\web\package.json` | dependencies 加 `"@liustack/modlens": "file:D:/develop/modlens"` |
| `C:\Users\刘增凡\.dsh\profiles\web\cordis.patch.yml` | insert modlens 插件行 |

## 剩余步骤（执行环境恢复后按序执行）

### 1. 构建 modlens CLI 引擎
```powershell
cd D:\develop\modlens
pnpm install        # 拉取 schemastery 等依赖（走代理：pnpm config 或临时环境变量）
pnpm build          # 生成 dist/main.js（CLI 引擎，插件 spawn 它）
node --check dsh\index.js && node --check dsh\settings.js
```

### 2. 安装到 profile
```powershell
cd C:\Users\刘增凡\.dsh\profiles\web
pnpm install        # 生成 node_modules/@liustack/modlens 链接（file:）
```

### 3. 重启 DSH 服务（用户操作）
```powershell
# 终端里 Ctrl+C 停掉，然后：
node --import tsx/esm apps/cli/src/bin.ts "web"
```

### 4. 验证
1. GUI 设置 → 插件配置 → 应出现 **modlens** 配置项
2. 配置阿里引擎：provider=`openai`，baseUrl=`https://dashscope.aliyuncs.com/compatible-mode/v1`，apiKey=`DASHSCOPE_API_KEY` 的值，model=`qwen3-vl-flash`
3. 检查 `~/.modlens/config.json` 是否写入 provider/providers（apiKey 不应出现在文件里）
4. 模型选择器应出现 `DeepSeek-V4-Flash (modlens vision)` 变体
5. 选该模型 → 粘贴图片 → 消息保留缩略图 + 模型读到证据文本
6. 或直接要求模型调用 `read_image` 工具读本地图片路径

## 故障记录

- pwsh/grep/glob 工具全部崩溃（exit 3221225794 = 0xC0000409）——DSH 子进程执行层故障，
  需重启 DSH 服务恢复。重启后先跑 `Write-Output "test"` 验证工具恢复。
- 代理：git/npm 需要走 `http://127.0.0.1:7897`（用户偶尔开代理）。
