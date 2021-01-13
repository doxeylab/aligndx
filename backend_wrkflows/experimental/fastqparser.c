#include <zlib.h>
#include <stdio.h>
#include "kseq.h"
KSEQ_INIT(gzFile, gzread)

int main() {
    gzFile fp;
    kseq_t *seq;
    fp = gzdopen(fileno(stdin), "r");
    seq = kseq_init(fp);
    while (kseq_read(seq) >= 0) puts(seq->seq.s);
    kseq_destroy(seq);
    gzclose(fp);
    return 0;
  }