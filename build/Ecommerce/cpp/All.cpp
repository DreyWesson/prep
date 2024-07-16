#include "All.hpp"
std::string toLower(std::string &str)
{
    std::transform(str.begin(), str.end(), str.begin(), [](unsigned char c)
                   { return tolower(c); });
    return str;
}