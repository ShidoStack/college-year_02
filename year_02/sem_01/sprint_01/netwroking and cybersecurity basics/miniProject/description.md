# Enterprise Multi-VLAN Network with EtherChannel, Inter-VLAN Routing, OSPF, DHCP, NAT/PAT, ACLs and RSTP

## 1. Project Overview

This project is an enterprise-style computer network designed and implemented in **Cisco Packet Tracer**. The network models a small organization with multiple departments, centralized Layer 3 switching, redundant switch uplinks, dynamic routing, DHCP, Internet-style address translation, management networking, and Guest-network security.

The design was built with the following goals:

- Separate departments into logically isolated VLANs.
- Provide centralized inter-VLAN routing using a multilayer switch.
- Use **LACP EtherChannel** to aggregate redundant physical links between the Core and Access switches.
- Prevent Layer 2 loops using **Rapid PVST+ / RSTP**.
- Dynamically distribute routes using **OSPF Area 0**.
- Automatically assign end-device IP addresses using **DHCP**.
- Translate private internal addresses through **NAT/PAT** at the edge router.
- Provide a dedicated Guest VLAN with restricted access to internal networks using an **extended ACL**.
- Provide a dedicated management VLAN for infrastructure administration.
- Create a topology that is suitable both for practical demonstration and networking viva questions.

The final network contains:

- **1 Cisco 3560 multilayer Core switch**
- **5 Cisco 2960 Access switches**
- **2 Cisco ISR4331 routers**
- **50 departmental PCs**
- **1 web/server host**

---

# 2. High-Level Topology

```text
                                  WEB-SERVER
                               198.51.100.10
                                      |
                                      |
                               R2 - ISR4331
                               Gi0/0/1
                                  |
                         203.0.113.0/30
                                  |
                               R1 - ISR4331
                         Gi0/0/0       Gi0/0/1
                            |             |
                     192.168.10.176/30   |
                            |             |
                            |        203.0.113.0/30
                            |
                    CORE - Cisco 3560
                    Multilayer Switch
                    Inter-VLAN Routing
                    DHCP
                    STP Root
                    OSPF
                            |
          -------------------------------------------------
          |             |             |             |       |
        Po1           Po2           Po3           Po4     Po5
       LACP          LACP          LACP          LACP    LACP
          |             |             |             |       |
        SW1           SW2           SW3           SW4     SW5
       ADMIN           HR          SALES           IT     GUEST
      VLAN 10        VLAN 20       VLAN 30       VLAN 40 VLAN 50
          |             |             |             |       |
      10 PCs         10 PCs        10 PCs        10 PCs  10 PCs
```

Each Access switch has **two physical uplinks** to the Core. These two links are bundled into one logical EtherChannel using LACP.

The Core performs Layer 3 routing for all user VLANs. The routers form the routed backbone toward the server network.

---

# 3. Device Inventory

| Device | Model | Role |
|---|---|---|
| CORE | Cisco Catalyst 3560 | Multilayer Core, inter-VLAN routing, DHCP, STP root, OSPF |
| SW1 | Cisco Catalyst 2960 | ADMIN Access switch |
| SW2 | Cisco Catalyst 2960 | HR Access switch |
| SW3 | Cisco Catalyst 2960 | SALES Access switch |
| SW4 | Cisco Catalyst 2960 | IT Access switch |
| SW5 | Cisco Catalyst 2960 | GUEST Access switch |
| R1 | Cisco ISR4331 | Edge/distribution router, NAT/PAT, OSPF |
| R2 | Cisco ISR4331 | Server-side router, OSPF |
| WEB-SERVER | Server | Server / external network destination |
| 50 PCs | End devices | Departmental clients |

---

# 4. Department and VLAN Design

The network uses separate VLANs for each department. This divides the large Layer 2 network into smaller broadcast domains and allows policy enforcement between departments.

| VLAN | Name | Department | Network | Default Gateway |
|---:|---|---|---|---|
| 10 | ADMIN | Administration | 192.168.10.0/27 | 192.168.10.1 |
| 20 | HR | Human Resources | 192.168.10.32/27 | 192.168.10.33 |
| 30 | SALES | Sales | 192.168.10.64/27 | 192.168.10.65 |
| 40 | IT | IT Department | 192.168.10.96/27 | 192.168.10.97 |
| 50 | GUEST | Guest Network | 192.168.10.128/27 | 192.168.10.129 |
| 99 | MANAGEMENT | Network Management | 192.168.10.160/28 | 192.168.10.161 |

Each /27 user subnet provides 30 usable addresses. This is sufficient for the ten assigned PCs while leaving room for future devices.

The management VLAN uses a /28 subnet because it only needs a small number of infrastructure addresses.

---

# 5. Physical Port Allocation

## SW1 – ADMIN

```text
Fa0/1  - Fa0/10  -> ADMIN PCs
Fa0/23            -> CORE Fa0/1
Fa0/24            -> CORE Fa0/2
Po1               -> LACP EtherChannel trunk
```

## SW2 – HR

```text
Fa0/1  - Fa0/10  -> HR PCs
Fa0/23            -> CORE Fa0/3
Fa0/24            -> CORE Fa0/4
Po2               -> LACP EtherChannel trunk
```

## SW3 – SALES

```text
Fa0/1  - Fa0/10  -> SALES PCs
Fa0/23            -> CORE Fa0/5
Fa0/24            -> CORE Fa0/6
Po3               -> LACP EtherChannel trunk
```

## SW4 – IT

```text
Fa0/1  - Fa0/10  -> IT PCs
Fa0/23            -> CORE Fa0/7
Fa0/24            -> CORE Fa0/8
Po4               -> LACP EtherChannel trunk
```

## SW5 – GUEST

```text
Fa0/1  - Fa0/10  -> GUEST PCs
Fa0/23            -> CORE Fa0/9
Fa0/24            -> CORE Fa0/10
Po5               -> LACP EtherChannel trunk
```

A dedicated Guest test host was also used during validation on an unused access port.

---

# 6. Core-to-Router and Router-to-Server Links

The Layer 3 backbone is:

```text
CORE Gi0/1  <------>  R1 Gi0/0/0

R1 Gi0/0/1  <------>  R2 Gi0/0/0

R2 Gi0/0/1  <------>  WEB-SERVER Fa0
```

These links are routed Layer 3 connections rather than VLAN trunks.

Addressing:

### CORE ↔ R1

```text
Network: 192.168.10.176/30
CORE:    192.168.10.177
R1:      192.168.10.178
```

### R1 ↔ R2

```text
Network: 203.0.113.0/30
R1:      203.0.113.1
R2:      203.0.113.2
```

### R2 ↔ Server Network

```text
Network:     198.51.100.0/24
R2:          198.51.100.1
WEB-SERVER:  198.51.100.10
```

The use of small /30 point-to-point subnets conserves address space while clearly separating routed infrastructure links from user VLANs.

---

# 7. VLAN Configuration

The Core and Access switches use the following logical VLANs:

```text
VLAN 10  ADMIN
VLAN 20  HR
VLAN 30  SALES
VLAN 40  IT
VLAN 50  GUEST
VLAN 99  MANAGEMENT
```

Access ports are assigned to their department VLAN. For example, all user-facing ports on SW1 are access ports in VLAN 10, while all user-facing ports on SW5 belong to VLAN 50.

This creates clear Layer 2 boundaries:

```text
ADMIN traffic  -> VLAN 10
HR traffic     -> VLAN 20
SALES traffic  -> VLAN 30
IT traffic     -> VLAN 40
GUEST traffic  -> VLAN 50
Management     -> VLAN 99
```

---

# 8. Trunking Design

The Core-to-Access EtherChannels are configured as 802.1Q trunk links.

Only the VLANs needed by each Access switch plus the management VLAN are allowed across its trunk.

| Access Switch | Port-Channel | Allowed VLANs |
|---|---|---|
| SW1 | Po1 | 10, 99 |
| SW2 | Po2 | 20, 99 |
| SW3 | Po3 | 30, 99 |
| SW4 | Po4 | 40, 99 |
| SW5 | Po5 | 50, 99 |

This limits unnecessary VLAN propagation and makes the topology easier to understand and troubleshoot.

An access port carries traffic for one VLAN, while a trunk can carry multiple VLANs using VLAN tags.

---

# 9. EtherChannel and LACP

Each Access switch has two physical uplinks to the Core. Rather than treating them as two unrelated links, they are bundled into one logical link.

The design uses **EtherChannel with LACP (Link Aggregation Control Protocol)**.

```text
SW1 <==== two physical links ==== > CORE
                   |
                  Po1

SW2 <==== two physical links ==== > CORE
                   |
                  Po2

SW3 <==== two physical links ==== > CORE
                   |
                  Po3

SW4 <==== two physical links ==== > CORE
                   |
                  Po4

SW5 <==== two physical links ==== > CORE
                   |
                  Po5
```

### Why EtherChannel is used

If the two physical links were treated independently, STP would potentially block one of them to prevent a Layer 2 loop. EtherChannel allows the switch to view the member links as one logical connection.

Benefits:

- Increased aggregate bandwidth.
- Redundancy if one physical member fails.
- Simpler STP topology.
- One logical Port-Channel to configure as the trunk.

### LACP

LACP dynamically negotiates the aggregation of compatible links. The project uses the active LACP mode to form the EtherChannels.

A healthy bundle is expected to show:

```text
PoN(SU)
```

with the physical member interfaces marked as participating in the bundle.

---

# 10. Inter-VLAN Routing using the Multilayer Core

The Cisco 3560 Core switch performs Layer 3 routing using Switch Virtual Interfaces (SVIs).

The Core has an SVI for every VLAN:

```text
VLAN 10 -> 192.168.10.1
VLAN 20 -> 192.168.10.33
VLAN 30 -> 192.168.10.65
VLAN 40 -> 192.168.10.97
VLAN 50 -> 192.168.10.129
VLAN 99 -> 192.168.10.161
```

IP routing is enabled on the multilayer switch.

For example, an ADMIN PC using `192.168.10.1` as its default gateway sends traffic for another subnet to the Core. The Core then routes the packet to the destination VLAN.

This is called **inter-VLAN routing**.

The project intentionally uses a multilayer switch rather than router-on-a-stick. This keeps the routing function centralized in the Core and makes the design more enterprise-like.

---

# 11. Management VLAN

VLAN 99 is reserved for network infrastructure management.

Management IPs:

| Device | Management IP |
|---|---:|
| CORE | 192.168.10.161 |
| SW1 | 192.168.10.162 |
| SW2 | 192.168.10.163 |
| SW3 | 192.168.10.164 |
| SW4 | 192.168.10.165 |
| SW5 | 192.168.10.166 |

Separating management traffic from user VLANs is a common enterprise design practice. It allows switch administration traffic to be grouped into its own logical network and makes management policies easier to implement.

---

# 12. RSTP / Rapid PVST+

Spanning Tree Protocol is implemented to protect the Layer 2 switching environment from loops.

The Core is configured as the primary STP root for the project VLANs using Rapid PVST+.

Conceptually:

```text
CORE = STP Root
        |
  -------------------
  |   |   |   |   |
 SW1 SW2 SW3 SW4 SW5
```

The redundant EtherChannel architecture provides physical redundancy while the spanning-tree system provides loop prevention.

### PortFast

PortFast is enabled on host-facing access ports because these ports are intended to connect to end devices such as PCs rather than other switches.

PortFast lets a host-facing port move through the spanning-tree process rapidly instead of waiting through normal Layer 2 convergence stages.

### STP troubleshooting during implementation

During testing, Packet Tracer displayed unusual RSTP edge-port states on several Guest access ports. The ports could show a designated/blocking state even though they were intended for end hosts. Physical link behavior was also affected by auto-negotiation in the Packet Tracer simulation.

The implementation therefore included direct interface checks and explicit speed/duplex settings where necessary to obtain stable simulated links. The final project was validated after these issues were resolved.

The important point is that troubleshooting was performed without redesigning the overall topology or removing the redundant Core/Access architecture.

---

# 13. DHCP Design

DHCP is centralized on the Core multilayer switch.

Each user VLAN has its own DHCP pool.

| Pool | Network | Gateway | Reserved range | Client range |
|---|---|---|---|---|
| ADMIN | 192.168.10.0/27 | 192.168.10.1 | .1 - .10 | .11 - .30 |
| HR | 192.168.10.32/27 | 192.168.10.33 | .33 - .42 | .43 - .62 |
| SALES | 192.168.10.64/27 | 192.168.10.65 | .65 - .74 | .75 - .94 |
| IT | 192.168.10.96/27 | 192.168.10.97 | .97 - .106 | .107 - .126 |
| GUEST | 192.168.10.128/27 | 192.168.10.129 | .129 - .138 | .139 - .158 |

The first addresses of each subnet are reserved for infrastructure and other manually assigned values, while the remaining range is dynamically assigned to clients.

### DHCP process

The standard DHCP process is:

```text
DORA

D = Discover
O = Offer
R = Request
A = Acknowledgement
```

A PC that is configured for DHCP broadcasts a Discover message. The DHCP service responds with an available lease and network configuration such as the subnet mask and default gateway.

The project successfully demonstrated dynamic addresses, including examples such as:

```text
ADMIN-PC01 -> 192.168.10.11
HR-PC01    -> 192.168.10.43
```

---

# 14. OSPF Dynamic Routing

The routed backbone uses **OSPF (Open Shortest Path First)** in **Area 0**.

Router IDs:

```text
CORE = 1.1.1.1
R1   = 2.2.2.2
R2   = 3.3.3.3
```

Logical routing path:

```text
CORE  <----OSPF---->  R1  <----OSPF---->  R2
 |                                      |
 |                                      |
 User VLANs                         Server Network
```

### Why OSPF is used

OSPF is a link-state Interior Gateway Protocol. Instead of manually configuring every route, participating routers exchange topology information and calculate routes using the Shortest Path First process.

This makes the routed design more scalable than relying entirely on static routes.

### Advertised networks

CORE advertises:

```text
192.168.10.0/24
192.168.10.176/30
```

R1 advertises:

```text
192.168.10.176/30
203.0.113.0/30
```

R2 advertises:

```text
203.0.113.0/30
198.51.100.0/24
```

The OSPF neighbors form an adjacency across the routed links, and routes learned through OSPF appear in the routing tables as OSPF-learned routes.

---

# 15. NAT and PAT

R1 acts as the translation boundary between the private internal network and the outside/server-side network.

The internal organization uses private IPv4 addressing from `192.168.10.0/24`.

R1 translates internal traffic to its outside interface address using **PAT (Port Address Translation)**, also called NAT overload.

Conceptually:

```text
ADMIN-PC01
192.168.10.11
      |
      | private traffic
      v
     R1
      |
      | translated source
      v
203.0.113.1
      |
      v
     R2
      |
      v
198.51.100.10
```

### NAT roles

R1 `Gi0/0/0` is the NAT inside interface.

R1 `Gi0/0/1` is the NAT outside interface.

The NAT rule uses an ACL to identify internal addresses and overloads the single outside interface address so multiple internal hosts can share it.

### Example verified translation

An internal host such as:

```text
192.168.10.11
```

can appear externally as:

```text
203.0.113.1
```

with PAT using transport-layer port information to distinguish multiple sessions.

The project successfully demonstrated traffic from an internal host reaching:

```text
198.51.100.10
```

and the R1 NAT translation table showed the corresponding translated session.

---

# 16. Guest VLAN Security using an Extended ACL

The Guest network is intentionally separated from the organization's internal VLANs.

Guest subnet:

```text
192.168.10.128/27
```

The Guest security policy is designed to prevent Guest hosts from directly accessing the internal `192.168.10.0/24` organizational networks while still allowing traffic toward permitted external destinations.

The extended ACL logic is conceptually:

```text
DENY:
Guest subnet -> internal 192.168.10.0/24

PERMIT:
Guest subnet -> other destinations
```

Example ACL structure used in the project:

```text
ip access-list extended GUEST_RESTRICTION
 deny ip 192.168.10.128 0.0.0.31 192.168.10.0 0.0.0.255
 permit ip 192.168.10.128 0.0.0.31 any
```

The ACL is applied inbound on the VLAN 50 SVI.

### Why the explicit permit is important

ACLs are processed from top to bottom. Once a packet matches a rule, processing stops.

There is also an implicit deny at the end of an ACL. Therefore, after intentionally denying Guest-to-internal traffic, an explicit permit is required for the Guest traffic that should continue toward other destinations.

---

# 17. End-to-End Traffic Flow Examples

## Example A – ADMIN PC to its default gateway

```text
ADMIN-PC01
192.168.10.11
      |
      v
SW1 VLAN 10
      |
     Po1
      |
      v
CORE SVI VLAN 10
192.168.10.1
```

The PC sends frames to its default gateway, the VLAN 10 SVI on the Core.

---

## Example B – ADMIN to another VLAN

```text
ADMIN-PC
VLAN 10
   |
   v
CORE VLAN 10 SVI
   |
   | Layer 3 routing
   v
CORE VLAN 20 SVI
   |
   v
HR PC
```

The Core receives the packet on VLAN 10, routes it at Layer 3, and forwards it into VLAN 20.

---

## Example C – Internal host to server

```text
PC
 |
Access Switch
 |
EtherChannel
 |
CORE
 |
Routed Link
 |
R1
 |
NAT/PAT
 |
R2
 |
WEB-SERVER
198.51.100.10
```

This path demonstrates multiple project technologies in one transaction:

1. Access VLAN.
2. EtherChannel trunk.
3. Layer 3 SVI routing.
4. OSPF-learned route.
5. NAT/PAT.
6. Routed router-to-router link.
7. Server-side routing.

---

## Example D – Guest traffic

```text
Guest PC
   |
 VLAN 50
   |
  SW5
   |
  Po5
   |
 CORE VLAN 50 SVI
   |
   +---- ACL policy ----+
   |                    |
internal networks     permitted destinations
 blocked               allowed
```

The Guest policy prevents direct access to the organization's internal addressing while retaining access to destinations that the ACL permits.

---

# 18. Key Cisco Technologies Demonstrated

## VLAN

A VLAN is a logical Layer 2 broadcast domain. It allows devices on the same physical switching infrastructure to be logically separated.

## Access Port

An access port is normally used for an end device and belongs to one VLAN.

## Trunk Port

A trunk carries traffic for multiple VLANs using IEEE 802.1Q VLAN tagging.

## SVI

A Switch Virtual Interface is the Layer 3 interface associated with a VLAN on a multilayer switch. It acts as the default gateway for hosts in that VLAN.

## Inter-VLAN Routing

Inter-VLAN routing allows devices in different IP subnets/VLANs to communicate through a Layer 3 routing device.

## EtherChannel

EtherChannel groups several physical links into one logical link.

## LACP

LACP is a standards-based protocol used to negotiate and maintain link aggregation.

## STP / RSTP

Spanning Tree prevents switching loops. Rapid PVST+ provides faster convergence compared with traditional 802.1D STP.

## DHCP

DHCP automatically distributes addresses and other network parameters to clients.

## OSPF

OSPF is a link-state interior gateway routing protocol that dynamically learns routes.

## NAT

NAT changes IP addressing as traffic crosses a translation boundary.

## PAT

PAT allows many internal sessions to share one translated IPv4 address by distinguishing sessions using port information.

## ACL

An Access Control List applies ordered permit/deny rules to traffic.

---

# 19. Important Verification Commands

The following commands were used during configuration and validation.

## VLAN verification

```text
show vlan brief
```

## Interface and SVI status

```text
show ip interface brief
```

## EtherChannel verification

```text
show etherchannel summary
```

## Trunk verification

```text
show interfaces trunk
```

## Spanning-tree verification

```text
show spanning-tree vlan 50
show spanning-tree interface fa0/xx detail
```

## MAC address verification

```text
show mac-address-table
```

## DHCP verification

```text
show ip dhcp pool
show ip dhcp binding
```

## Routing verification

```text
show ip route
```

## OSPF neighbor verification

```text
show ip ospf neighbor
```

## NAT verification

```text
show ip nat translations
show ip nat statistics
```

## Interface-specific verification

```text
show interfaces fa0/xx status
show interfaces fa0/xx
```

These commands provide evidence for both the configuration and the operational state of the network.

---

# 20. Testing Strategy

The project was validated progressively instead of configuring every feature blindly at once.

Testing included:

### Layer 1 – Physical Connectivity

- Cable connections checked.
- Interface up/down state checked.
- Speed and duplex checked where Packet Tracer negotiation caused issues.

### Layer 2 – Switching

- VLAN membership verified.
- Access port assignments verified.
- Trunks verified.
- EtherChannels verified.
- STP root and port states inspected.
- MAC address learning verified.

### Layer 3 – Routing

- SVI addresses verified.
- Default gateways tested.
- Inter-VLAN communication tested.
- OSPF neighbor relationships verified.
- Dynamic routes verified.

### Services

- DHCP address allocation tested.
- NAT/PAT translations inspected.
- Server reachability tested.

### Security

- Guest traffic policy tested through the VLAN 50 ACL.

---

# 21. Troubleshooting Experience

The implementation included several realistic Packet Tracer troubleshooting scenarios.

## EtherChannel bundling issue

An early configuration attempt produced an EtherChannel bundling error because member interfaces had inconsistent VLAN/trunk parameters before aggregation.

The reliable process was to:

1. Reset inconsistent member configuration when necessary.
2. Place matching physical interfaces into the LACP channel group.
3. Verify that the Port-Channel formed.
4. Configure the Port-Channel itself as the trunk.
5. Verify allowed VLANs.

This demonstrated an important operational rule: EtherChannel member links must be compatible before they can form one logical bundle.

## Endpoint speed/duplex issue

Some Packet Tracer endpoint ports did not establish the expected physical link under automatic negotiation. Manual `speed 100` and `duplex full` settings were used during troubleshooting, following instructor guidance.

This led to a stable connected state such as:

```text
connected
VLAN 50
a-full
a-100
```

The incident also demonstrated why Layer 1 verification should happen before diagnosing higher-layer problems.

## STP state investigation

Some Guest access ports displayed unexpected RSTP states in Packet Tracer. Commands such as:

```text
show spanning-tree vlan 50
show spanning-tree interface fa0/xx detail
```

were used to distinguish STP behavior from VLAN, cable, and physical-interface problems.

This troubleshooting process reinforced the layered approach to networking:

```text
Layer 1 -> Layer 2 -> Layer 3 -> Services -> Security
```

---

# 22. Design Rationale

## Why a multilayer switch?

The Core 3560 can perform high-speed Layer 3 routing between VLANs without forcing all inter-VLAN traffic through a separate router.

## Why five access switches?

Each department has a dedicated access layer, making the topology easy to understand and scale.

## Why two uplinks per access switch?

They provide physical redundancy and additional aggregate bandwidth when combined with EtherChannel.

## Why LACP?

LACP provides standardized dynamic link aggregation and makes it easier to maintain the logical bundle.

## Why VLAN 99?

A dedicated management VLAN keeps infrastructure management separate from ordinary user traffic.

## Why OSPF?

OSPF demonstrates real dynamic routing rather than relying only on manually configured static routes.

## Why DHCP?

It eliminates manual configuration for normal client addressing and demonstrates a centralized network service.

## Why NAT/PAT?

It demonstrates the translation normally required when private internal addressing communicates with an external network.

## Why a Guest ACL?

Guest devices should not automatically have the same internal access as organizational departments. A dedicated ACL provides explicit Layer 3 traffic policy.

---

# 23. Network Addressing Summary

```text
====================================================
USER VLANs
====================================================

VLAN 10 ADMIN       192.168.10.0/27
Gateway             192.168.10.1

VLAN 20 HR          192.168.10.32/27
Gateway             192.168.10.33

VLAN 30 SALES       192.168.10.64/27
Gateway             192.168.10.65

VLAN 40 IT          192.168.10.96/27
Gateway             192.168.10.97

VLAN 50 GUEST       192.168.10.128/27
Gateway             192.168.10.129

VLAN 99 MANAGEMENT  192.168.10.160/28
Gateway             192.168.10.161

====================================================
ROUTED LINKS
====================================================

CORE-R1             192.168.10.176/30
CORE                192.168.10.177
R1                  192.168.10.178

R1-R2               203.0.113.0/30
R1                  203.0.113.1
R2                  203.0.113.2

====================================================
SERVER NETWORK
====================================================

Server network      198.51.100.0/24
R2                  198.51.100.1
WEB-SERVER          198.51.100.10
```

---

# 24. Management Address Summary

```text
CORE    192.168.10.161
SW1     192.168.10.162
SW2     192.168.10.163
SW3     192.168.10.164
SW4     192.168.10.165
SW5     192.168.10.166
```

All these addresses belong to VLAN 99.

---

# 25. Final Feature Checklist

```text
[✓] Enterprise topology designed
[✓] 50 departmental PCs connected
[✓] 5 departmental VLANs created
[✓] Dedicated Management VLAN created
[✓] Access ports assigned correctly
[✓] 802.1Q trunking implemented
[✓] Five LACP EtherChannels implemented
[✓] Multilayer Core switch deployed
[✓] SVIs configured
[✓] Inter-VLAN routing enabled
[✓] RSTP / Rapid PVST+ implemented
[✓] Core configured as STP root
[✓] DHCP pools configured
[✓] DHCP client addressing verified
[✓] R1-R2 routed backbone implemented
[✓] OSPF Area 0 implemented
[✓] OSPF adjacencies verified
[✓] Dynamic routes learned
[✓] NAT/PAT configured on R1
[✓] NAT translations verified
[✓] Guest VLAN security ACL implemented
[✓] End-to-end connectivity tested
[✓] Troubleshooting performed
[✓] Network ready for demonstration and viva
```

---

# 26. Suggested Viva Explanation

A concise way to explain the entire project during a viva is:

> "I designed an enterprise-style network with five departmental VLANs and a dedicated management VLAN. Each department has its own access switch, and every access switch has two uplinks to a multilayer Core switch using LACP EtherChannel. The Core performs inter-VLAN routing through SVIs and also provides DHCP services. RSTP is used to prevent Layer 2 loops, with the Core acting as the spanning-tree root. The Core, R1, and R2 form a routed backbone using OSPF Area 0. R1 performs NAT/PAT so private internal hosts can access the external/server-side network. Finally, VLAN 50 is treated as a Guest network and an extended ACL restricts Guest traffic from reaching internal organizational networks."

That explanation connects virtually every major configuration component into one coherent design.

---

# 27. Project Outcome

The completed project demonstrates a practical enterprise network rather than a collection of isolated Cisco commands. The technologies work together as a layered system:

```text
                    APPLICATION / SERVICES
                              |
                  +-----------+-----------+
                  |                       |
                DHCP                    NAT/PAT
                  |                       |
                  +-----------+-----------+
                              |
                         LAYER 3 ROUTING
                              |
                  +-----------+-----------+
                  |                       |
               OSPF                    ACLs
                  |                       |
                  +-----------+-----------+
                              |
                         MULTILAYER CORE
                              |
                    INTER-VLAN ROUTING
                              |
                         802.1Q TRUNKS
                              |
                         ETHERCHANNEL
                              |
                      RSTP / LOOP CONTROL
                              |
                         ACCESS LAYER
                              |
                    DEPARTMENTAL END HOSTS
```

The final architecture provides segmentation, redundancy, dynamic routing, automatic addressing, address translation, management separation, and Guest traffic control in one integrated Cisco Packet Tracer project.

---

# 28. Technologies Used — Quick Reference

```text
Cisco Packet Tracer
Cisco Catalyst 3560
Cisco Catalyst 2960
Cisco ISR4331
VLANs
802.1Q Trunking
SVIs
Inter-VLAN Routing
EtherChannel
LACP
RSTP / Rapid PVST+
PortFast
DHCP
OSPF Area 0
NAT
PAT / NAT Overload
Extended ACLs
IPv4 Subnetting
Layer 2 Switching
Layer 3 Routing
Network Troubleshooting
```

---

# 29. Final Summary

This project implements a complete enterprise-oriented Cisco network in Packet Tracer with a clear separation between access, core, and routed edge functions.

The **Access layer** connects departmental devices and assigns them to the correct VLANs. The **Core layer** provides centralized switching and routing, DHCP, management connectivity, and spanning-tree control. The **routing layer** uses OSPF to connect the internal network to the server-side network, while **R1 provides NAT/PAT** for private-to-external communication. The **Guest VLAN** is additionally protected by an ACL that separates Guest traffic from internal organizational networks.

The result is a structured, scalable, and demonstrable networking project that covers many of the core concepts expected in a practical Computer Networks / Cyber Security laboratory:

- network segmentation,
- redundancy,
- loop prevention,
- routing,
- address allocation,
- address translation,
- traffic filtering,
- infrastructure management,
- and systematic troubleshooting.

This document describes the final architecture, addressing plan, technologies, logical behavior, verification approach, and implementation decisions so that another person can understand the complete project without needing the original step-by-step conversation.
