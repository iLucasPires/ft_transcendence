{
  lib,
  buildNpmPackage,
  fetchFromGitHub,
}:
buildNpmPackage {
  pname = "nest-cli";
  version = "10.2.1";
  src = fetchFromGitHub {
    owner = "nestjs";
    repo = "nest-cli";
    rev = "10.2.1";
    hash = "sha256-vnF+ES6RK4iiIJsWUV57DqoLischh+1MlmlK46Z6USY=";
  };
  npmDepsHash = "sha256-9yd+k+HpARM63/esW+av0zfcuAVsp9Lkfp6hmUQO5Yg=";
  meta = with lib; {
    description = "CLI tool for Nest applications 🍹";
    homepage = "https://nestjs.com";
    license = licenses.mit;
  };
}
