#!/usr/bin/env bash
fly -t lite sp -p ttp -c pipeline.yml --load-vars-from secrets.yml
