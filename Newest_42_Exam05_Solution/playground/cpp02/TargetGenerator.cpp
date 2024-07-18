#include "TargetGenerator.hpp"

TargetGenerator::TargetGenerator() {}

TargetGenerator::~TargetGenerator() 
{
    std::map<std::string, ATarget *>::iterator it = book.begin();
    while (it != book.end())
    {
        delete it->second;
        ++it;
    }
    book.clear();
}

void TargetGenerator::learnTargetType(ATarget * spell)
{
        std::map<std::string, ATarget *>::iterator it = book.find(spell->getType());
        if (it != book.end())
        {
            delete it->second;
        }
        if (spell)
            book[spell->getType()] = spell->clone();
}

void TargetGenerator::forgetTargetType(std::string const & type)
{
    std::map<std::string, ATarget *>::iterator it = book.find(type);
    if (it != book.end())
    {
        delete it->second;
        book.erase(it);
    }
}

ATarget * TargetGenerator::createTarget(std::string const & type)
{
    std::map<std::string, ATarget *>::iterator it = book.find(type);
    if (it != book.end())
    {
        return it->second->clone();
    }

    return NULL;
}
