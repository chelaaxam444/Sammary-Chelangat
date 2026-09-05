import { BundleFile, NodeItem, DestinationItem } from '../types';

export const INITIAL_FILES: BundleFile[] = [
  {
    id: 'f-1',
    name: 'TR_cecily_main.db',
    sizeBytes: 1524711424, // ~1.42 GB
    sizeFormatted: '1.42 GB',
    modified: 'Oct 24, 2023',
    type: 'database',
    checksum: '8f2a9c11b0e357d19762e84128f7d9834e56bb30',
    description: 'Primary relational SQLite / key-value core data store containing processed records, entity vectors, and index pointers.',
    previewContent: `[BINARY SQLITE 3 / RocksDB STORAGE FORMAT]
Header: SQLite format 3\x00
Page Size: 4096 bytes
Schema Cookie: 142
Total Pages: 372,244
Tables:
  - cecily_entities (id INT PRIMARY KEY, name TEXT, hash TEXT, payload BLOB)
  - cecily_vectors (id INT, dim_1536 BLOB, cluster_id INT)
  - cecily_journal (timestamp DATETIME, event_type TEXT, actor_ref TEXT)
Indexed rows: 1,842,900 records validated.`
  },
  {
    id: 'f-2',
    name: 'TR_cecily_index.idx',
    sizeBytes: 13002342, // ~12.4 MB
    sizeFormatted: '12.4 MB',
    modified: 'Oct 24, 2023',
    type: 'index',
    checksum: '3a41b59c8d10372ef82b901a0937a892b951c22d',
    description: 'HNSW spatial & lexical query search index optimized for sub-millisecond document retrieval.',
    previewContent: `[HNSW SEARCH INDEX FORMAT v2.4]
Graph Depth: 16 layers
Max M: 64
efConstruction: 200
Metric: Cosine Distance
Dimensions: 1536
Graph Nodes Count: 248,500
Integrity Verification: OK (Zero isolated clusters)`
  },
  {
    id: 'f-3',
    name: 'TR_cecily_meta.json',
    sizeBytes: 4300, // ~4.2 KB
    sizeFormatted: '4.2 KB',
    modified: 'Oct 24, 2023',
    type: 'json',
    checksum: 'e7192f039a7b218413a94827dcb85839201948ae',
    description: 'Manifest descriptor containing schema version, snapshot origin, permissions, and security hashes.',
    previewContent: `{
  "bundle_id": "TR-CECILY-20231024-V4",
  "project": "TR Cecily Master Core",
  "version": "4.2.0-rc1",
  "generated_at": "2023-10-24T18:45:00.000Z",
  "author": "TR Infrastructure Node #09",
  "encryption": {
    "algorithm": "AES-256-GCM",
    "cipher_mode": "hardware_accelerated",
    "salt_bits": 512
  },
  "datasets": [
    {
      "name": "core_entities",
      "records": 1842900,
      "format": "sqlite"
    },
    {
      "name": "search_indices",
      "entries": 248500,
      "format": "hnsw_graph"
    }
  ],
  "compatibility": {
    "min_engine": "v2.8.0",
    "target_platform": "POSIX / Darwin / Win64"
  }
}`
  },
  {
    id: 'f-4',
    name: 'config.xml',
    sizeBytes: 1126, // ~1.1 KB
    sizeFormatted: '1.1 KB',
    modified: 'Oct 22, 2023',
    type: 'xml',
    checksum: '61bc08912e847629501a3964db21839174092b15',
    description: 'XML system deployment profiles, port bindings, and endpoint sync directives.',
    previewContent: `<?xml version="1.0" encoding="UTF-8"?>
<DataBridgeConfiguration version="1.4">
  <Cluster nodeID="TR-CECILY-ALPHA">
    <Host>sftp.tr-gateway.internal</Host>
    <Port>2222</Port>
    <Protocol>SSH_SFTP</Protocol>
    <CipherSuite>aes256-gcm@openssh.com</CipherSuite>
    <KeepAliveInterval>30</KeepAliveInterval>
  </Cluster>
  <LocalMount target="Desktop">
    <Path default="~/Desktop/TR_cecily_export" />
    <AutoVerifyChecksums>true</AutoVerifyChecksums>
    <PreserveTimestamps>true</PreserveTimestamps>
    <BufferChunkSizeKB>65536</BufferChunkSizeKB>
  </LocalMount>
</DataBridgeConfiguration>`
  },
  {
    id: 'f-5',
    name: 'cecily_assets.tar.gz',
    sizeBytes: 403164160, // ~384.5 MB
    sizeFormatted: '384.5 MB',
    modified: 'Oct 23, 2023',
    type: 'archive',
    checksum: '9d2358bc1039841f7105284b1a89047b2c918304',
    description: 'Compressed asset tarball with schema diagrams, iconography, and sample training fixtures.',
    previewContent: `[GZIP COMPRESSED TAR ARCHIVE]
Contents:
  drwxr-xr-x assets/
  -rw-r--r-- assets/brand_spec.pdf (1.2 MB)
  -rw-r--r-- assets/entity_definitions.csv (4.8 MB)
  -rw-r--r-- assets/schema_visualizer.svg (420 KB)
  drwxr-xr-x assets/fixtures/ (378.1 MB)
Archive verified: 0 bad CRC blocks.`
  },
  {
    id: 'f-6',
    name: 'checksums.sha256',
    sizeBytes: 512,
    sizeFormatted: '512 B',
    modified: 'Oct 24, 2023',
    type: 'checksum',
    checksum: '1102938475619283746592837465918273645192',
    description: 'Cryptographic SHA-256 hashes verifying bit-level bundle integrity.',
    previewContent: `8f2a9c11b0e357d19762e84128f7d9834e56bb30 *TR_cecily_main.db
3a41b59c8d10372ef82b901a0937a892b951c22d *TR_cecily_index.idx
e7192f039a7b218413a94827dcb85839201948ae *TR_cecily_meta.json
61bc08912e847629501a3964db21839174092b15 *config.xml
9d2358bc1039841f7105284b1a89047b2c918304 *cecily_assets.tar.gz`
  }
];

export const NODES: NodeItem[] = [
  {
    id: 'node-tr',
    name: 'Remote Server: TR',
    type: 'remote',
    status: 'active',
    path: '/opt/data/clusters/cecily_bundle_v4',
    protocol: 'SFTP (SSH-2.0)'
  },
  {
    id: 'node-cloud',
    name: 'Cloud Storage',
    type: 'cloud',
    status: 'ready',
    path: 's3://datacenter-backup/tr-snapshots',
    protocol: 'HTTPS REST API'
  },
  {
    id: 'node-archive',
    name: 'Internal Archive',
    type: 'archive',
    status: 'ready',
    path: '/mnt/cold_storage/cecily_history',
    protocol: 'NFSv4.1'
  }
];

export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-desktop',
    name: 'My Desktop',
    path: '~/Desktop/TR_cecily/',
    availableSpace: '148.2 GB free',
    isDefault: true
  },
  {
    id: 'dest-docs',
    name: 'Documents',
    path: '~/Documents/DataBridge/',
    availableSpace: '148.2 GB free'
  },
  {
    id: 'dest-downloads',
    name: 'Downloads',
    path: '~/Downloads/TR_export/',
    availableSpace: '148.2 GB free'
  }
];
