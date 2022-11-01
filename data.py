
class Data:
    def __init__(self):
        self.roadnet_options = {
            'NY48' : 'ny48_roadnet_log.json',
            'Hangzhou': 'hangzhou_roadnet_log.json',
            '4x4': '4x4_roadnetLogFile.json',
            '2x2': '2x2_roadnetLogFile.json'
        }
        self.replay_options = {
            'NY48': {
                'double_analytic': '1_ny48double_analytic.txt', 
                'triple_analytic': '1_ny48triple_analytic.txt'
            },
            'Hangzhou': {
                'default': '1_hangzhou_analytic.txt'
            },
            '4x4': {
                'default': '1_4x4_analytic.txt'
            },
            '2x2': {
                'default': '1_2x2_analytic.txt'
            }
        }
    
    def get_roadnet_options(self):
        return list(self.roadnet_options.keys())
    
    def get_replay_options_for_roadnet(self, roadnet_option):
        return list(self.replay_options[roadnet_option].keys())

    def get_roadnet_file(self, roadnet_option):
        return self.roadnet_options[roadnet_option]

    def get_replay_file(self, roadnet_option, replay_option):
        return self.replay_options[roadnet_option][replay_option]