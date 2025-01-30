# 1. 使用 Node.js 作为基础镜像
FROM node:18-alpine

# 2. 设置工作目录
WORKDIR /app

# 3. 复制所有代码
COPY . .

# 4. 安装依赖（
# 4.1 --productionはいらない
# 4.2 "postinstall": "prisma generate"というスクリプトがあるので、prisma generateはいらないです
# ）
RUN npm install

# 5. 构建 Next.js
RUN npm run build

# 6. 运行 Next.js
CMD ["npm", "run", "start"]
