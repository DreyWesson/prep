#pragma once

#include <iostream>
#include <map>
#include "ATarget.hpp"
// #include "ATarget.hpp"

class ATarget;
// class ATarget;

class TargetGenerator {
private:

    TargetGenerator(const TargetGenerator &src);
    TargetGenerator &operator=(const TargetGenerator &src);

    std::map<std::string, ATarget *>targetList;

protected:

public:
    TargetGenerator();
    ~TargetGenerator();


    void learnTargetType(ATarget *spell);
    void forgetTargetType(const std::string &spellName);
    ATarget* createTarget(std::string const &spellName);
};