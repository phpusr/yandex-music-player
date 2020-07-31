SPACE=18

# src: https://gist.github.com/prwhite/8168133#gistcomment-2833138
help:
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-${SPACE}s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ AUR dist creator

make-dist: ## Make dist
	cd dist && makepkg

update-dist: ## Update dist metadata
	cd dist && updpkgsums && mksrcinfo

install-dist: ## Install dist
	sudo pacman -U dist/yandex-music-player-*.pkg.tar.xz

clean-dist: ## Clean dist dir
	cd dist && git clean -fdx
