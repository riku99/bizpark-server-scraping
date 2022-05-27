#!/bin/bash
if [ "$NODE_ENV" = "production" ]
then
yarn ts-node --transpile-only ./src/index.ts
elif [ "$NODE_ENV" = 'development' ]
then
yarn ts-node-dev ./src/index.ts
fi