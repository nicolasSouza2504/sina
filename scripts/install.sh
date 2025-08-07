#!/bin/bash
set -e


#Prepare Project .env
cp .env-example .env

#Prepare Backend .env
cd backend
cp .env-example .env

#Prepare Front .env
cd ../frontend
cp .env-example .env
