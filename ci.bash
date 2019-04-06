#!/bin/bash
echo "ci bash start!"
# 打包代码入库 npm run build会被杀掉
cd `pwd`
npm i
npm run build
pm2 startOrRestart pm2.js
echo "ci bash over!"
exit 0
