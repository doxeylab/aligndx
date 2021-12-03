#include <string>
#include <vector>

#include <lz4.h>
#include <emscripten/emscripten.h>

std::pair<const char *, size_t> compress_LZ4(std::string data)
{
    size_t src_size = data.size();
    size_t dst_capacity = LZ4_compressBound(src_size);

    const char *src = data.c_str();
    char dst[dst_capacity];

    size_t dst_size = LZ4_compress_default(src, dst, src_size, dst_capacity);
    return {dst, dst_size};
}

extern "C"
{
    EMSCRIPTEN_KEEPALIVE int compress(char *result_ptr, char *data)
    {
        std::pair<const char *, size_t> p = compress_LZ4(std::string(data));
        std::memcpy(result_ptr, p.first, p.second);

        return p.second;
    }
}