
class Data:
    def __init__(self):
        self.roadnet_options = {
            '2x2': '2x2_roadnetLogFile.json',
            '4x4': '4x4_roadnetLogFile.json',
            'Hangzhou': 'hangzhou_roadnet_log.json',
            'NY48' : 'ny48_roadnet_log.json'
        }
        self.replay_options = {
            'NY48': {
                'GuidedLight': 'ny48_hybrid.txt',
                'PressLight' : 'ny48_presslight.txt',
                'Analytic+' : 'ny48_analytical.txt',
                'Demand' : 'ny48_demand.txt',
                'Fixed' : 'ny48_fixed.txt'
            },
            'Hangzhou': {
                'GuidedLight': 'hangzhou_hybrid.txt',
                'PressLight' : 'hangzhou_presslight.txt',
                'Analytic+' : 'hangzhou_analytical.txt',
                'Demand' : 'hangzhou_demand.txt',
                'Fixed' : 'hangzhou_fixed.txt'
            },
            '4x4': {
                'GuidedLight': '4x4_hybrid.txt',
                'PressLight' : '4x4_presslight.txt',
                'Analytic+' : '4x4_analytical.txt',
                'Demand' : '4x4_demand.txt',
                'Fixed' : '4x4_fixed.txt'
            },
            '2x2': {
                'GuidedLight': '2x2_hybrid.txt',
                'PressLight' : '2x2_presslight.txt',
                'Analytic+' : '2x2_analytical.txt',
                'Demand' : '2x2_demand.txt',
                'Fixed' : '2x2_fixed.txt'
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