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
    ifstream file("messages.txt");
    string line;
    int id = 0;
    while (getline(file, line)) {
        messageList.push_back(line);
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

        string query = toLower(req.get_param_value("q"));
        json result;

        if (invertedIndex.find(query) != invertedIndex.end()) {
            for (int id : invertedIndex[query]) {
                result["results"].push_back(messageList[id]);
            }
        } else {
            result["results"] = json::array();
        }

        res.set_content(result.dump(), "application/json");
    });

    cout << "Server started at http://localhost:8080" << endl;
    svr.listen("0.0.0.0", 8080);
}
