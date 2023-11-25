echo "eval $(direnv hook bash)" >> $HOME/.bashrc

cat << EOF
NPM version: $(npm --version)
Node version: $(node --version)
EOF
