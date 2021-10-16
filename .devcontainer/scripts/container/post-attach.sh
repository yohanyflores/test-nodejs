#!/usr/bin/env bash

echo "========================================="
echo "Post Attach Command"

# Vemos los enviromens
echo "========================================="
env
echo "========================================="

# Informacion del usuario
echo $(id)

user="$(id -un)"
group="$(id -gn)"

