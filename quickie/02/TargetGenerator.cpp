#include "TargetGenerator.hpp"
#include "ATarget.hpp"

TargetGenerator::TargetGenerator() {}

TargetGenerator::~TargetGenerator() {
    std::map<std::string, ATarget *>::iterator it = targetList.begin();
    while (it != targetList.end()) {
        delete it->second;
        it++;
    }
    targetList.clear();
}



void TargetGenerator::learnTargetType(ATarget *target) {
    if (target) {
        std::map<std::string, ATarget *>::iterator it = targetList.find(target->getType());
        if (it != targetList.end()) {
            delete it->second;
        }
        targetList[target->getType()] = target->clone();
    }
}

void TargetGenerator::forgetTargetType(const std::string &targetName) {
    if (!targetName.empty()) {
        std::map<std::string, ATarget *>::iterator it = targetList.find(targetName);
        if (it != targetList.end()) {
            delete it->second;
            targetList.erase(it);
        }
    }
}

ATarget* TargetGenerator::createTarget(std::string const &targetName) {
        std::map<std::string, ATarget *>::iterator it = targetList.find(targetName);
        if (it != targetList.end()) {
            return it->second->clone();
        }
        return NULL;
}


