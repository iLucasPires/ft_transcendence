{
  inputs.nixpkgs.url = "nixpkgs";
  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      overlays = builtins.attrValues self.overlays;
    };
  in {
    apps.${system} = {
      nest-cli = {
        type = "app";
        program = "${pkgs.nest-cli}/bin/nest";
      };
    };
    packages.${system} = {
      nest-cli = import ./nix/pkgs/nest-cli {
        inherit (pkgs) lib buildNpmPackage fetchFromGitHub;
      };
    };
    overlays = {
      nest-cli = final: prev: {
        nest-cli = self.packages.${final.system}.nest-cli;
      };
    };
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nest-cli
        nodejs_20

        nodePackages_latest.npm
        nodePackages_latest.prettier
        nodePackages_latest.typescript-language-server
        nodePackages_latest.serve
        nodePackages_latest.vscode-langservers-extracted
      ];
    };
  };
}
