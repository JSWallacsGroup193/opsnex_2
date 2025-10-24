#!/bin/bash
npm --prefix apps/frontend install
npm --prefix apps/backend install
concurrently \
  "npm --prefix apps/frontend run dev" \
  "npm --prefix apps/backend run start:dev"
