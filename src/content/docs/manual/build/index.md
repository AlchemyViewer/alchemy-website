---
title: Building Alchemy Viewer
description: Full build documentation for Alchemy Viewer on Windows, macOS, and Linux.
---

Everything needed to build Alchemy from source: platform setup, presets, options, tests, packaging, and troubleshooting.

- [Prerequisites](#prerequisites)
- [Platform setup](#platform-setup)
- [Clone and bootstrap](#clone-and-bootstrap)
- [Configure](#configure)
- [Build](#build)
- [Configuration types](#configuration-types)
- [Build options](#build-options)
- [Running tests](#running-tests)
- [Packaging](#packaging)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Every platform needs a C++ toolchain plus:

- **CMake** 3.27+
- **Git**
- **Python** 3.13+ (used for build-time scripts)
- **Rust** and **.NET SDK** (only required when producing installer packages, enabled by default)

Install commands are platform-specific and listed below.

## Platform setup

### Windows

Install the following:

- [Visual Studio 2026](https://visualstudio.microsoft.com/vs/community/) or Visual Studio 2022 with the **Desktop development with C++** workload
- [CMake](https://cmake.org/download/) 3.27+
- [Git for Windows](https://git-scm.com/install/windows)
- [Python 3.13+](https://www.python.org/downloads/) (enable **Add Python to PATH** during install)
- [Rust](https://rust-lang.org/tools/install/) (packaging only)
- [.NET SDK](https://dotnet.microsoft.com/en-us/download) (packaging only)

Sanity-check in a fresh terminal:

```bash
cmake --version
python --version
git --version
```

### macOS

Install [Xcode](https://developer.apple.com/xcode/) from the App Store, then run:

```bash
xcode-select --install
```

Install [Homebrew](https://brew.sh/) dependencies:

```bash
brew install git cmake zip unzip curl pkgconf automake autoconf autoconf-archive \
    gettext libtool rustup dotnet
```

Initialize the Rust toolchain (packaging only):

```bash
rustup-init -y
```

### Linux

Install system packages for your distro:

#### Arch

```bash
sudo pacman -Syu automake autoconf autoconf-archive base-devel cmake fontconfig git glib2-devel \
    gstreamer gst-plugins-base-libs ninja libglvnd libtool libvlc libx11 pkgconf python \
    wayland dotnet-sdk rustup zip
```

#### Debian 12+

```bash
sudo apt install \
    autoconf autoconf-archive automake bison build-essential cmake curl flex gettext \
    libasound2-dev libaudio-dev libdbus-1-dev libdecor-0-dev libdrm-dev \
    libegl1-mesa-dev libfribidi-dev libgbm-dev libgl1-mesa-dev libgles2-mesa-dev \
    libgstreamer-plugins-base1.0-dev libgstreamer1.0-dev libibus-1.0-dev libjack-dev \
    libosmesa6-dev libpipewire-0.3-dev libpulse-dev libsndio-dev libtext-unidecode-perl \
    libthai-dev libtool libudev-dev libunwind-dev liburing-dev libvlc-dev libwayland-dev \
    libx11-dev libxcursor-dev libxext-dev libxfixes-dev libxft-dev libxi-dev libxinerama-dev \
    libxkbcommon-dev libxrandr-dev libxss-dev libxtst-dev linux-libc-dev ninja-build \
    pkgconf tar tex-common texinfo unzip zip dotnet-sdk-10.0 rustup
```

#### Ubuntu 22.04+

```bash
sudo apt install \
    autoconf autoconf-archive automake bison build-essential cmake curl flex gettext \
    libasound2-dev libaudio-dev libdbus-1-dev libdecor-0-dev libdrm-dev \
    libegl1-mesa-dev libfribidi-dev libgbm-dev libgl1-mesa-dev libgles2-mesa-dev \
    libgstreamer-plugins-base1.0-dev libgstreamer1.0-dev libibus-1.0-dev libjack-dev \
    libosmesa6-dev libpipewire-0.3-dev libpulse-dev libsndio-dev libtext-unidecode-perl \
    libthai-dev libtool libudev-dev libunwind-dev liburing-dev libvlc-dev libwayland-dev \
    libx11-dev libxcursor-dev libxext-dev libxfixes-dev libxft-dev libxi-dev libxinerama-dev \
    libxkbcommon-dev libxrandr-dev libxss-dev libxtst-dev linux-libc-dev ninja-build \
    pkgconf tar tex-common texinfo unzip zip dotnet-sdk-10.0 rustup
```

#### Fedora / RHEL

**AlmaLinux 10:**

```bash
sudo dnf group install "Development Tools"
sudo dnf install cmake fontconfig-devel git glib2-devel gstreamer1-devel \
    gstreamer1-plugins-base-devel libX11-devel mesa-libOSMesa-devel libglvnd-devel \
    ninja-build python3 vlc-devel wayland-devel dotnet-sdk-10.0 rustup
```

You may need to enable EPEL first:

```bash
sudo dnf install epel-release
```

**Fedora 44+:**

```bash
sudo dnf install @development-tools @c-development cmake fontconfig-devel git glib-devel \
    gstreamer1-devel gstreamer1-plugins-base-devel libX11-devel \
    mesa-compat-libOSMesa-devel libglvnd-devel ninja-build python3 vlc-devel \
    wayland-devel dotnet-sdk-10.0 rustup perl-IPC-Cmd perl-FindBin perl-Time-Piece \
    autoconf-archive perl-open libXcursor-devel wayland-protocols-devel dbus-devel \
    ibus-devel mesa-libGLU-devel libxkbcommon-devel mesa-libEGL-devel mesa-libGL-devel \
    libXtst-devel libXrandr-devel pipewire-devel pulseaudio-libs-devel alsa-lib-devel
```

To build with Clang instead of GCC, also install:

```bash
sudo dnf install clang lld
```

#### OpenSUSE Tumbleweed

```bash
sudo zypper in -t pattern devel_basis devel_C_C++
sudo zypper install cmake fontconfig-devel git glib2-devel gstreamer-devel \
    gstreamer-plugins-base-devel libglvnd-devel libX11-devel ninja Mesa-libGL-devel \
    python3 vlc-devel wayland-devel
```

Initialize a stable Rust toolchain (packaging only):

```bash
rustup default stable
```

## Clone and bootstrap

Alchemy vendors the [Dullahan](https://github.com/AlchemyViewer/dullahan) CEF wrapper as a git submodule under `indra/dullahan`. It builds from source as part of the tree, so the submodule must be present before configure.

Clone with submodules, then set up Python venv and .NET tools:

```bash
git clone --recurse-submodules https://github.com/AlchemyViewer/Alchemy.git alchemy
cd alchemy
python3 -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
# Unix:    source .venv/bin/activate
pip install -r requirements.txt
dotnet tool restore        # packaging only
```

Already cloned without `--recurse-submodules`? Fetch submodules before configuring:

```bash
git submodule update --init --recursive
```

After pulling upstream changes, run the same command to keep submodules in sync with the expected revision.

## Configure

Build configuration is driven by CMake presets defined in:

- [indra/CMakePresets.json](https://github.com/AlchemyViewer/Alchemy/blob/develop/indra/CMakePresets.json)

List all available presets:

```bash
cmake -S indra --list-presets
```

### Naming convention

Preset names follow `<generator>[-<arch>][-os]`:

- `-os` suffix: open-source only (excludes proprietary components such as KDU and FMOD).
- No `-os` suffix: sets `INSTALL_PROPRIETARY=ON` and requires licensed proprietary sources.

Most contributors should use `-os` variants.

### Common presets

| Preset                                       | Platform | Generator          |
|:---------------------------------------------|:---------|:-------------------|
| `vs2026-os`, `vs2022-os`                     | Windows  | Visual Studio      |
| `ninja-os`                                   | Linux    | Ninja Multi-Config |
| `ninja-os-arm64`, `ninja-os-x64`             | macOS    | Ninja Multi-Config |
| `xcode-os`, `xcode-os-arm64`, `xcode-os-x64` | macOS    | Xcode              |

Configure with:

```bash
cmake -S indra --preset <preset-name>
```

This creates a build tree at `build-<HostSystem>-<preset>/` next to the source, for example:

- `build-Windows-vs2026-os/`
- `build-Linux-ninja-os/`
- `build-Darwin-xcode-os-arm64/`

The first configure run downloads and builds all vcpkg dependencies from source. Expect 30-60+ minutes and several GB of disk usage.

#### Platform notes

- **macOS**: `xcode-os` and `ninja-os` (no arch suffix) target host architecture. Use explicit `-arm64` or `-x64` presets for cross-builds.
- **Linux with Clang**: append `-DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_LINKER_TYPE=LLD` to the configure command.

### Workflow presets (one-shot configure + build)

Workflow presets run configure and build together:

```bash
cmake --workflow --preset ninja-os-release
cmake --workflow --preset vs2026-os-release
cmake --workflow --preset xcode-os-release
```

See `workflowPresets` in [indra/CMakePresets.json](https://github.com/AlchemyViewer/Alchemy/blob/develop/indra/CMakePresets.json).

## Build

After configuring, build with CMake or your IDE.

### From the command line

```bash
# Multi-config generators (VS, Xcode, Ninja Multi-Config)
cmake --build <build-dir> --config Release

# Or use a build preset
cmake --build --preset ninja-os-release
```

### From an IDE

```bash
# Visual Studio
start .\build-Windows-vs2026-os\Alchemy.slnx

# Xcode
open ./build-Darwin-xcode-os-arm64/Alchemy.xcodeproj
```

> `.slnx` is the newer Visual Studio solution format and requires VS 2022 17.10+ or VS 2026.

### Output locations

The viewer executable is created under `build-<OS>-<preset>/newview/<Config>/`:

- Windows: `build-Windows-<preset>\\newview\\<Config>\\<ChannelName>.exe`
- macOS: `build-Darwin-<preset>/newview/<Config>/<ChannelName>.app`
- Linux: `build-Linux-<preset>/newview/<Config>/<ChannelName>`

`<ChannelName>` follows `VIEWER_CHANNEL` (default `Alchemy Test` -> `AlchemyTest.exe` / `AlchemyTest.app`).

## Configuration types

Ninja and Xcode presets are multi-config; Visual Studio presets always are. Choose at build time with `--config <Config>` or use a build preset with config baked in.

- `Debug`: debug libraries, asserts enabled, slowest, best for deep debugging.
- `OptDebug`: release libraries with asserts, good balance for dev debugging.
- `RelWithDebInfo`: release libraries with asserts, default for Ninja presets.
- `Release`: release libraries, asserts disabled, shipping builds.

## Build options

Override options at configure time with `-D<NAME>=<VALUE>`. Example:

```bash
cmake -S indra --preset ninja-os -DBUILD_TESTING=ON -DUSE_FMODSTUDIO=ON
```

Options are defined in:

- [indra/CMakeLists.txt](https://github.com/AlchemyViewer/Alchemy/blob/develop/indra/CMakeLists.txt)

### Build targets

- `BUILD_VIEWER` (default `ON`): build the viewer executable.
- `BUILD_APPEARANCE_UTIL` (default `OFF`): build the appearance utility.
- `BUILD_TESTING` (default `OFF`): build and run unit and integration tests.
- `PACKAGE` (default `ON`): produce installer packages after viewer build (requires Velopack).
- `USE_VELOPACK` (default `OFF`): use Velopack for installer packaging instead of NSIS/DMG.

### Audio

| Option           | Default | Description                            |
|:-----------------|:--------|:---------------------------------------|
| `USE_OPENAL`     | ON      | OpenAL audio engine                    |
| `USE_FMODSTUDIO` | OFF     | FMOD Studio audio engine (proprietary) |

### Profiling

| Option                 | Default            | Description                                  |
|:-----------------------|:-------------------|:---------------------------------------------|
| `USE_TRACY`            | ON for test builds | Tracy profiler support                       |
| `USE_TRACY_ON_DEMAND`  | ON                 | Only profile when a Tracy server connects    |
| `USE_TRACY_LOCAL_ONLY` | ON                 | Disallow remote Tracy profiling              |
| `USE_TRACY_GPU`        | OFF                | Tracy GPU profiling                          |

### Optimization and instrumentation

- `USE_LTO` (default `OFF`): enable Link Time Optimization.
- `USE_SSE4_2`, `USE_AVX`, `USE_AVX2` (default `OFF`): target SIMD instruction sets (x86_64 only).
- `ENABLE_ASAN`, `ENABLE_UBSAN`, `ENABLE_THREADSAN` (default `OFF`): enable sanitizers on macOS/Linux.
- `<COMPILER>_DISABLE_FATAL_WARNINGS` (default `OFF`): disable warnings-as-errors for `VS`, `GCC`, or `CLANG`.
- `DISABLE_RELEASE_DEBUG_LOGGING` (default varies): strip debug-level logging from Release builds.

### Media plugins

| Option                   | Default     | Description                                  |
|:-------------------------|:------------|:---------------------------------------------|
| `BUILD_CEF_PLUGIN`       | ON          | Chromium Embedded Framework (in-world web)   |
| `BUILD_VLC_PLUGIN`       | ON          | VLC media plugin                             |
| `BUILD_GSTREAMER_PLUGIN` | ON on Linux | GStreamer media plugin (Linux only)          |
| `BUILD_EXAMPLE_PLUGIN`   | ON          | Reference/example plugin                     |

### Platform-specific

| Option           | Default     | Description                                                |
|:-----------------|:------------|:-----------------------------------------------------------|
| `USE_NVAPI`      | ON          | NVIDIA NVAPI for GPU profile support (Windows only)        |
| `USE_OPENXR`     | OFF         | OpenXR VR support (experimental)                           |
| `USE_SDL_WINDOW` | ON on Linux | SDL-based window management (Linux only; Wayland path)     |

### Crash reporting

| Option                        | Default | Description                                  |
|:------------------------------|:--------|:---------------------------------------------|
| `USE_SENTRY`                  | OFF     | Sentry crash reporting                       |
| `RELEASE_CRASH_REPORTING`     | OFF     | Enable crash reporting in Release builds     |
| `NON_RELEASE_CRASH_REPORTING` | OFF     | Enable crash reporting in developer builds   |

See [indra/CMakeLists.txt](https://github.com/AlchemyViewer/Alchemy/blob/develop/indra/CMakeLists.txt) for the complete list.

## Running tests

Enable tests at configure time:

```bash
cmake -S indra --preset <preset> -DBUILD_TESTING=ON
```

Build, then run with CTest:

```bash
cmake --build <build-dir> --config RelWithDebInfo
ctest --test-dir <build-dir> --output-on-failure
```

Unit tests live alongside the library they cover in `indra/<library>/tests/`, written with TUT (Template Unit Test). Integration tests are in `indra/integration_tests/`.

## Packaging

Release packages are produced by [Velopack](https://velopack.io). The packaging step runs automatically after a successful build when `PACKAGE=ON` (default).

To skip packaging during development:

```bash
cmake -S indra --preset <preset> -DPACKAGE=OFF
```

Velopack also requires `dotnet tool restore` so the `vpk` CLI is available.

## Troubleshooting

### Configure fails: `indra/dullahan` has no `CMakeLists.txt`

The Dullahan CEF wrapper is a git submodule. If you cloned without `--recurse-submodules`, `indra/dullahan` will be empty and configure fails with an error like:

```text
CMake Error at CMakeLists.txt (add_subdirectory):
  The source directory .../indra/dullahan does not contain a CMakeLists.txt file.
```

Fetch submodules, then re-run configure:

```bash
git submodule update --init --recursive
```

### First `cmake -S indra --preset ...` takes forever

Expected on first run: vcpkg downloads and builds all C/C++ dependencies from source. Budget 30-60+ minutes and several GB of disk. Subsequent configure runs reuse the cache and complete quickly.

If output appears stalled for a long time, check CPU and disk activity before killing the process.

### CMake is too old

Alchemy requires CMake 3.27+. If your distro ships older CMake, install newer tools in your venv:

```bash
pip install --upgrade cmake ninja
```

### `vpk` command not found (or packaging step fails)

Velopack needs the `vpk` .NET tool. Install it once per clone:

```bash
dotnet tool restore
```

If you do not need installers, disable packaging with `-DPACKAGE=OFF` and skip Rust/.NET setup.

### Rust or `cargo` missing during packaging

Packaging uses Velopack, which invokes Cargo. Install a stable Rust toolchain:

```bash
rustup default stable
```

Only required when `PACKAGE=ON`.

### Warnings fail the build

Warnings are treated as errors by default. New compiler releases may introduce diagnostics not yet cleaned up in the tree. Disable fatal warnings for the affected toolchain at configure time:

```bash
# MSVC / Visual Studio
cmake -S indra --preset vs2026-os -DVS_DISABLE_FATAL_WARNINGS=TRUE

# GCC
cmake -S indra --preset ninja-os -DGCC_DISABLE_FATAL_WARNINGS=TRUE

# Clang
cmake -S indra --preset ninja-os -DCLANG_DISABLE_FATAL_WARNINGS=TRUE
```

### Visual Studio does not recognize `Alchemy.slnx`

`.slnx` is the newer Visual Studio solution format. Use Visual Studio 2022 17.10+ or Visual Studio 2026, or configure with `vs2022-os` on a compatible older edition.

### `cmake --build --preset ninja-os-release` fails with "no such preset"

You likely configured with a proprietary preset (for example `ninja` without `-os`). Build presets are tied to configure presets. Use the matching build preset for the configure preset you selected (for example `ninja-release` for `ninja`).

### Linux: missing system headers during vcpkg builds

Double-check the distro package list in [Platform setup](#platform-setup). Common missing packages when errors look like `<something>.h not found`:

- `autoconf-archive` (required by several vcpkg ports)
- `libxkbcommon-dev`, `libwayland-dev`, `wayland-protocols` (required for SDL/Wayland support)
- `libgstreamer-plugins-base1.0-dev` (required for the GStreamer media plugin)

### Still stuck?

- Ask on [Discord](https://discordapp.com/invite/KugCgs6)
- File a build bug at <https://github.com/AlchemyViewer/Alchemy/issues>

## See also

- [Troubleshooting Builds](./troubleshooting)
- [Content contributions](../../contributing/content-contributions)
