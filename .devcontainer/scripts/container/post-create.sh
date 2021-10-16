#!/usr/bin/env bash

SCRIPT_PATH="`dirname \"$0\"`"              # relative
SCRIPT_PATH="`( cd \"$SCRIPT_PATH\" && pwd )`"  # absolutized and normalized
if [ -z "$SCRIPT_PATH" ] ; then
  # error; for some reason, the path is not accessible
  # to the script (e.g. permissions re-evaled after suid)
  exit 1  # fail
fi

echo "========================================="
echo "Post Create Command"


# Informacion del usuario
echo $(id)

# Verificamos permisos de docker.sock
if [ -e /var/run/docker.sock ]; then
    sudo chmod 666 /var/run/docker.sock
fi

# region Manejo de SSH
user="$(id -un)"
group="$(id -gn)"

# Creamos la carpeta .ssh
mkdir -p  ${HOME}/.ssh 
chmod 700 ${HOME}/.ssh/

# agregamos algunso host a los host conocidos.
ssh-keyscan bitbucket.org >> ${HOME}/.ssh/known_hosts || true
ssh-keyscan github.com    >> ${HOME}/.ssh/known_hosts || true
ssh-keyscan gitlab.com    >> ${HOME}/.ssh/known_hosts || true

# Establecemos permisos sobre el folder ssh.
chmod 600 ${HOME}/.ssh/* || true
chmod 644 ${HOME}/.ssh/*.pub || true


# Ejecutamos yarn install
yarn install

# endregion
