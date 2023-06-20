
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
                'GuidedLight': 'ny48_hybrid',
                'PressLight' : 'ny48_presslight',
                'Analytic+' : 'ny48_analytical',
                'Demand' : 'ny48_demand',
                'Fixed' : 'ny48_fixed'
            },
            'Hangzhou': {
                'GuidedLight': 'hangzhou_hybrid',
                'PressLight' : 'hangzhou_presslight',
                'Analytic+' : 'hangzhou_analytical',
                'Demand' : 'hangzhou_demand',
                'Fixed' : 'hangzhou_fixed'
            },
            '4x4': {
                'GuidedLight': '4x4_hybrid',
                'PressLight' : '4x4_presslight',
                'Analytic+' : '4x4_analytical',
                'Demand' : '4x4_demand',
                'Fixed' : '4x4_fixed'
            },
            '2x2': {
                'GuidedLight': '2x2_hybrid',
                'PressLight' : '2x2_presslight',
                'Analytic+' : '2x2_analytical',
                'Demand' : '2x2_demand',
                'Fixed' : '2x2_fixed'
            }
        }
    
    def get_roadnet_options(self):
        return list(self.roadnet_options.keys())
    
    def get_replay_options_for_roadnet(self, roadnet_option):
        return list(self.replay_options[roadnet_option].keys())

    def get_roadnet_file(self, roadnet_option):
        return self.roadnet_options[roadnet_option]

    def get_replay_file(self, roadnet_option, replay_option):
        return self.replay_options[roadnet_option][replay_option] + '.txt'
    
    def get_density_file(self, roadnet_option, replay_option):
        return self.replay_options[roadnet_option][replay_option] + '.json'