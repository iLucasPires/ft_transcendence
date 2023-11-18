{
  inputs.nixpkgs.url = "nixpkgs";
  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_20

        nodePackages_latest.npm
        nodePackages_latest.prettier
        nodePackages_latest.typescript-language-server
        nodePackages_latest.vscode-langservers-extracted
      ];
    };
  };
}
