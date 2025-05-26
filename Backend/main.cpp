#include "httplib.h"
#include <iostream>
#include <unordered_map>
#include <vector>
#include <set>
#include <sstream>
#include <fstream>
// #include <nlohmann/json.hpp>
#include "json.hpp"
#include <algorithm>
#include <cctype>

using namespace std;
using json = nlohmann::json;

unordered_map<string, set<int>> invertedIndex;
vector<string> messages;
vector<string> messageList;

string toLower(const string& str) {
    string result = str;
    transform(result.begin(), result.end(), result.begin(), ::tolower);
    return result;
}

// Helper to remove punctuation
string removePunct(const string& str) {
    string result;
    for (char c : str) {
        if (!ispunct(static_cast<unsigned char>(c)) || c == '\'') // keep apostrophes
            result += c;
    }
    return result;
}

string trimSpaces(const string& str) {
    string result;
    bool inSpace = false;
    for (char c : str) {
        if (isspace(static_cast<unsigned char>(c))) {
            if (!inSpace) {
                result += ' ';
                inSpace = true;
            }
        } else {
            result += c;
            inSpace = false;
        }
    }
    // Remove leading/trailing spaces
    if (!result.empty() && result.front() == ' ') result.erase(result.begin());
    if (!result.empty() && result.back() == ' ') result.pop_back();
    return result;
}

vector<string> splitWords(const string& line) {
    stringstream ss(line);
    string word;
    vector<string> words;

    while (ss >> word) {
        word.erase(remove_if(word.begin(), word.end(), ::ispunct), word.end());
        words.push_back(toLower(word));
    }
    return words;
}

void buildIndex() {
    messageList.clear();
    invertedIndex.clear();
    ifstream file("messages.txt");
    string line;
    int id = 0;
    while (getline(file, line)) {
        messageList.push_back(line);
        std::cout << "Loaded: " << line << std::endl; // Debug print
        for (const auto& word : splitWords(line)) {
            invertedIndex[word].insert(id);
        }
        id++;
    }
}

int main() {
    buildIndex();

    httplib::Server svr;

    svr.Get("/search", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        if (!req.has_param("q")) {
            res.status = 400;
            res.set_content("Missing query param `q`", "text/plain");
            return;
        }
        string query = trimSpaces(toLower(removePunct(req.get_param_value("q"))));
        std::cout << "Query: '" << query << "'" << std::endl;
        vector<string> results;

        for (const auto& line : messageList) {
            string lower_line = trimSpaces(toLower(removePunct(line)));
            std::cout << "Checking: '" << lower_line << "'" << std::endl;
            if (lower_line.find(query) != string::npos) {
                results.push_back(line);
            }
        }

        if (results.empty()) {
            json j;
            j["results"] = {};
            res.set_content(j.dump(), "application/json");
        } else {
            json j;
            j["results"] = results;
            res.set_content(j.dump(), "application/json");
        }
    });

    cout << "Server started at http://localhost:8080" << endl;
    svr.listen("0.0.0.0", 8080);
}

