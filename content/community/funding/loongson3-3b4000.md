+++
title = "[PREPARING] Upgrade BuildBot for the Loongson 3 Port"
+++

This is a proposal to crowdsource a dual Loongson 3B4000 motherboard from Lemote to supplement the current 3A4000 BuildBot (Relay 23869).

# Rationale

The current BuildBot for the AOSC OS Loongson 3 port is built and tested on a 3A4000-based server (Lemote LX-1901), which, with only four cores, hardly suffices as a sole BuildBot for distribution maintenance. The significant performance discrepancy when compared to AMD64 and AArch64 BuildBots also makes it difficult to coordinate packaging among our four mainline ports.

This proposal attempts to improve the computing capacity for the Loongson 3 port with the addition of a dual 3B4000-based system, which, with a total of eight cores (across two processors) can potentially provide double the performance compared to the current BuildBot.

# Budget

The following components will be purchased from Lemote:

+ Lemote LX-2510 motherboard (CNY 11,000)
  - Dual 3B4000 on board.
  - Includes compatible heatsink assemblies.
+ 2 × 16GB DIMM (CNY 750 × 2)
  - To be purchased from OEM to prevent incompatibility.

(Plus potential shipping fees)

The following additional components will be required, but could be crowdsourced (as donation or as funding).

+ Case
  - Must be E-ATX compatible.
+ Power supply
  - ATX Power supply, ~500W.
+ Storage
  - Ideally NVMe.

# Proposed Timeline

- End-of-Year 2021: Coordinator to complete purchase.
- Q1 2022:
    - A community contributor or colocation provider to host the Relay server.
    - Server to go online for distribution maintenance.

# Participants

- Leo Shen <szc1sya@aosc.io>, purchase contact.
- Xiaoxing Ye <xiaoxing@aosc.io>, proposed server host.
