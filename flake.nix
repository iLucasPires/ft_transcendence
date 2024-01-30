{
  inputs.nixpkgs.url = "nixpkgs";
  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        nest-cli
        nodejs_20
        nodePackages.typescript-language-server
        nodePackages.vscode-langservers-extracted
      ];
    };
  };
}
